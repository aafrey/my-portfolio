<script>
    import * as d3 from "d3";

    export let lines = [];
    export let width = 1200;
    export let svgWidth = 1200;
    let previousDotCounts = new Map();

    let svg;
    let colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    let files = [];
    $: files = d3.groups(lines, d => d.file)
            .map(([name, lines]) => ({ name, lines }))
            .sort((a, b) => b.lines.length - a.lines.length);;

    const firstColumnWidth = 150;
    const fileInfoMargin = 120;
    const dotsColumnX = firstColumnWidth + fileInfoMargin;
    const approxDotWidth = 18;
    const dotRowHeight = 10;
    const linesPerDot = 1;
    const baseY = 20;
    const totalLinesOffset = 20;
    const fileInfoHeight = baseY + totalLinesOffset;

    $: if (svg) {
        const totalHeight = positions.length
            ? positions[positions.length - 1] + filesWithHeights[filesWithHeights.length - 1].groupHeight
            : 0;
        d3.select(svg)
            .attr('width', svgWidth)
            .attr('height', totalHeight)
            .style('overflow', 'hidden');

        const groups = d3.select(svg)
            .selectAll('g.file')
            .data(filesWithHeights, d => d.name);

        groups.exit().remove();

        const enterGroups = groups.enter()
            .append('g')
            .attr('class', 'file')
            .attr('transform', (d, i) => `translate(0, ${positions[i]})`)

        enterGroups.append('text')
            .attr('class', 'filename')
            .attr('x', 10)
            .attr('y', baseY)
            .attr('dominant-baseline', 'hanging')
            .text(d => d.name);

        enterGroups.append('text')
            .attr('class', 'linecount')
            .attr('x', 10) 
            .attr('y', baseY + totalLinesOffset - 2)
            .attr('text-anchor', 'start')
            .attr('dominant-baseline', 'hanging')
            .text(d => `${d.lines.length} lines`);

            enterGroups.append('text')
            .attr('class', 'unit-dots')
            .attr('x', dotsColumnX)
            .attr('y', baseY - 4)
            .attr('dominant-baseline', 'mathematical')
            .attr('fill', "#1f77b4")
            .html(d => generateDots(d, svgWidth));
        
        groups.transition()
            .duration(function(d, i) {
                const currentTransform = this.getAttribute("transform") || "translate(0,0)";
                const match = currentTransform.match(/translate\(\s*0\s*,\s*([0-9.]+)\s*\)/);
                const oldY = match ? +match[1] : 0;
                const newY = positions[i];
                const distance = Math.abs(newY - oldY);
                return distance * 2;
            })
            .attr('transform', (d, i) => `translate(0, ${positions[i]})`)
            .select('text.filename')
            .text(d => d.name);

        groups.select('text.linecount')
            .text(d => `${d.lines.length} lines`)
            .attr('x', dotsColumnX - 80)
            .attr('text-anchor', 'start');

        groups.select('text.unit-dots')
            .html(d => generateDots(d, svgWidth))
            .attr('x', dotsColumnX)
            .attr('fill', "#1f77b4");

        groups.each(function (d) {
            const groupSel = d3.select(this);
            const unitDotsSel = groupSel.select('text.unit-dots');
            const newCount = d.lines.length;
            const oldCount = previousDotCounts.get(d.name) || 0;

            // Re-render all dots
            unitDotsSel.html(generateDots(d, svgWidth));
            console.log("width", width);

            if (newCount > oldCount) {
                unitDotsSel
                    .selectAll('tspan.dot')
                    .filter(function () {
                        return +this.getAttribute('data-index') >= oldCount;
                    })
                    .style('opacity', 0)
                    .transition()
                    .duration(1000)
                    .ease(d3.easeCubicOut)
                    .style('opacity', 1);
        }

            previousDotCounts.set(d.name, newCount);
});
    }

    function generateDots(file, svgWidth) {
        const totalDots = Math.ceil(file.lines.length / linesPerDot);
        const availableWidth = svgWidth - dotsColumnX;
        const maxDotsPerRow = Math.floor(availableWidth / approxDotWidth) || totalDots;
        let tspans = "";
        const dotRows = Math.ceil(totalDots / maxDotsPerRow);
        let dotIndex = 0;
        for (let r = 0; r < dotRows; r++) {
            const rowLines = file.lines.slice(r * maxDotsPerRow, (r + 1) * maxDotsPerRow);
            // const rowDots = rowLines.map(line => `<tspan class="dot" style="fill:${colorScale(line.type)}">•</tspan>`)
            //     .join('');
            // const rowDots = rowLines.map(line => {
            //     const span = `<tspan class="dot" data-index="${dotIndex}" style="fill:${colorScale(line.type)}">•</tspan>`;
            //     dotIndex += 1;
            //     return span;
            // }).join('');
            const rowDots = rowLines.map(line => {
                const span = `<tspan class="dot" data-index="${dotIndex}" style="fill:${colorScale(line.type)}; font-family:SFMono-Regular,Consolas,'Liberation Mono',Menlo,Courier,monospace">•</tspan>`;
                dotIndex += 1;
                return span;
            }).join('');
            // tspans += `<tspan x="${dotsColumnX}" dy="${r === 0 ? 0 : dotRowHeight + 'px'}">${rowDots}</tspan>`;
            tspans += `<tspan x="${dotsColumnX}" dy="${r === 0 ? 0 : dotRowHeight}">${rowDots}</tspan>`;

        }
        return tspans;
    }

    $: filesWithHeights = files.map(file => {
        const totalDots = Math.ceil(file.lines.length / linesPerDot);
        const availableWidth = width - dotsColumnX;
        const maxDotsPerRow = Math.floor(availableWidth / approxDotWidth) || totalDots;
        const dotRows = Math.ceil(totalDots / maxDotsPerRow);
        return { ...file, groupHeight: fileInfoHeight + dotRows * dotRowHeight };
    });

    $: positions = (() => {
        let pos = [], y = 0;
        for (const f of filesWithHeights) {
            pos.push(y);
            y += f.groupHeight;
        }
        return pos;
    })();

</script>

<!-- <svg bind:this={svg}></svg> -->
<svg bind:this={svg} width={svgWidth}></svg>

<style>
    :global(text.filename) {
        font-weight: bold;
        font-family: sans-serif;
    }

    :global(text.linecount) {
        font-size: 0.8rem;
        fill: grey;
        font-style: italic;
    }

    /* :global(text.unit-dots) {
        font-size: 1.5rem;       
        font-family: monospace;
        dominant-baseline: middle;
    } */

    :global(text.unit-dots) {
        font-size: 1.0rem;
        font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier, monospace;
        dominant-baseline: middle;
        line-height: 1.9;
    }

    :global(tspan.dot) {
        transition: opacity 0.3s ease;
    }

    /* :global(tspan.dot) {
        opacity: 0;
    } */
</style>

