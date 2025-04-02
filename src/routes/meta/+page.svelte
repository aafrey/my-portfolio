<script>
    import * as d3 from "d3";

    import { onMount } from "svelte";

    import Bar from '$lib/Bar.svelte';

    import {
	computePosition,
	autoPlacement,
	offset,
    } from '@floating-ui/dom';

    let data = [];
    let commits = [];
    let uniqueFiles = new Set();
    let clickedCommits = [];

    //Set circle size for commits
    $: rScale = d3.scaleSqrt()
        .domain(d3.extent(commits, d => d.totalLines)) // [min, max]
        .range([2, 30]); // <- min and max radius

    //Bind variable to tooltip element
    let commitTooltip;

    //Create variable to hold position of tooltip that we will update in our mouseenter event listener
    let tooltipPosition = {x: 100, y: 100};

    // Store last recorded mouse position

    // Add info for tooltip
    let hoveredIndex = -1;
    $: hoveredCommit = hoveredIndex >= 0 ? commits[hoveredIndex] : {};

    // Define width and height for plot
    let width = 1000, height = 600;
    let margin = {top: 10, right: 10, bottom: 30, left: 20};

    // Define a usable area
    let usableArea = {
	top: margin.top,
	right: width - margin.right,
	bottom: height - margin.bottom,
	left: margin.left
    };
    usableArea.width = usableArea.right - usableArea.left;
    usableArea.height = usableArea.bottom - usableArea.top;

    // Create variables to hold axes
    let xAxis, yAxis;
    let yAxisGridlines;

    // Apply axes
    $: {
        d3.select(xAxis).call(d3.axisBottom(xScale));
        d3.select(yAxis).call(d3.axisLeft(yScale).tickFormat(d => String(d % 24).padStart(2, "0") + ":00"));

    }
    $: {
        d3.select(yAxisGridlines).call(
            d3.axisLeft(yScale)
            .tickFormat("")
            .tickSize(-usableArea.width)
        );
    }

    onMount(async () => {
        data = await d3.csv("/loc.csv", row => ({
            ...row,
            line: Number(row.line),
            depth: Number(row.depth),
            length: Number(row.length),
            date: new Date(row.date + "T00:00" + row.timezone),
            datetime: new Date(row.datetime)
        }));

        data.forEach((row) => {
            uniqueFiles.add(row.file)
        });

        commits = d3.groups(data, d => d.commit).map(([commit, lines]) => {
            let first = lines[0];
            let {author, date, time, timezone, datetime} = first;
            let ret = {
                id: commit,
                url: "https://github.com/aafrey/my-portfolio/commit/" + commit,
                author, date, time, timezone, datetime,
                hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
                totalLines: lines.length,
            };

            // Like ret.lines = lines
            // but non-enumerable so it doesn’t show up in JSON.stringify
            Object.defineProperty(ret, "lines", {
                value: lines,
                configurable: true,
                writable: true,
                enumerable: false,
            });

            return ret;
        });
    });

    $: workByPeriod = d3.rollups(data, v => v.length, d => d.datetime.toLocaleString("en", {dayPeriod: "short"}))
    $: maxPeriod = d3.greatest(workByPeriod, (d) => d[1])?.[0];

    // Define scales for X and Y axes
    $: minDate = d3.min(commits.map(d => d.date));
    $: maxDate = d3.max(commits.map(d => d.date));
    $: maxDatePlusOne = new Date(maxDate);
    $: maxDatePlusOne.setDate(maxDatePlusOne.getDate() + 1);
    $: xScale = d3.scaleTime()
                        .domain([minDate, maxDatePlusOne])
                        .range([usableArea.left, usableArea.right])
                        .nice();

    $: yScale = d3.scaleLinear()
                        .domain([24,0])
                        .range([usableArea.bottom, usableArea.top]);

    async function dotInteraction (index, evt) {
        let hoveredDot = evt.target;
        if (evt.type === "mouseenter") {
            hoveredIndex = index;
            tooltipPosition = await computePosition(hoveredDot, commitTooltip, {
                strategy: "fixed", // because we use position: fixed
                middleware: [
                    offset(5), // spacing from tooltip to dot
                    autoPlacement() // see https://floating-ui.com/docs/autoplacement
                ],
            });        }
        else if (evt.type === "mouseleave") {
            hoveredIndex = -1
        }
        else if (evt.type === "click") {
            console.log(clickedCommits);
            let commit = commits[index]
            if (!clickedCommits.includes(commit)) {
                // Add the commit to the clickedCommits array
                clickedCommits = [...clickedCommits, commit];
            }
            else {
                    // Remove the commit from the array
                    clickedCommits = clickedCommits.filter(c => c !== commit);
            }
        }
    }

    // Set up bar chart
    // Create set for programming languages in project
    $: allTypes = Array.from(new Set(data.map(d => d.type)));

    // Choose which commits to include
    $: selectedLines = (clickedCommits.length > 0 ? clickedCommits : commits).flatMap(d => d.lines);

    // Aggregate all LOCs for each language
    $: selectedCounts = d3.rollup(
    selectedLines,
    v => v.length,
    d => d.type
    );

    // Ensure all languages are included
    $: languageBreakdown = allTypes.map(type => [type, selectedCounts.get(type) || 0]);
</script>

<h1>
    Meta!
</h1>

<p>
    This page includes statistics about my GitHub.
</p>
<svg viewBox="0 0 {width} {height}">
    Add gridlines!
    <g class="gridlines" transform="translate({usableArea.left}, 0)" bind:this={yAxisGridlines} />
    <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
    <g transform="translate({usableArea.left}, 0)" bind:this={yAxis} /> 
    <g class="dots">
        {#each commits as commit, index}
            <circle
                class:selected={ clickedCommits.includes(commit) }
                on:click={ evt => dotInteraction(index, evt) }
                on:mouseenter={evt => dotInteraction(index, evt)}
                on:mouseleave={evt => dotInteraction(index, evt)}
                cx={ xScale(commit.date) }
                cy={ yScale(commit.hourFrac) }
                r={ rScale(commit.totalLines) }
                fill="steelblue"
                fill-opacity={hoveredIndex === index ? 1 : 0.6}
                />
        {/each}
        </g>
</svg>

<Bar data={languageBreakdown} width={width} />

<dl 
    class="info tooltip" 
    hidden={hoveredIndex === -1} 
    style="top: {tooltipPosition.y}px; left: {tooltipPosition.x}px"
    bind:this={commitTooltip}>

    <dt>Commit</dt>
    <dd><a href="{ hoveredCommit.url }" target="blank">{ hoveredCommit.id }</a></dd>

    <dt>Date</dt>
    <dd>{ hoveredCommit.datetime?.toLocaleString("en", {dateStyle: "full"}) }</dd>

    <dt>Time</dt>
    <dd>{ hoveredCommit.datetime?.getHours() + ":" + hoveredCommit.datetime?.getMinutes()}</dd>

    <dt>Author</dt>
    <dd>{ hoveredCommit.author}</dd>

    <dt>Lines Edited</dt>
    <dd>{ hoveredCommit.totalLines}</dd>
</dl>

<dl class="stats">
    <dt>Total <abbr title="Lines of code">LOC</abbr></dt>
    <dd>{data.length}</dd>
    <dt>Number of Commits</dt>
    <dd>{commits.length}</dd>
    {#key data}
    <dt>Number of Files</dt>
    <dd>{uniqueFiles.size}</dd>
    {/key}
    <dt>When is most work done? </dt>
    <dd>{maxPeriod}</dd>
</dl>

<style>
    svg {
        overflow: visible;
    }
</style>


