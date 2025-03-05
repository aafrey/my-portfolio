<script src="../global.js"></script>
<h1>Contact Me!</h1>
        <form action="mailto:aafrey@mit.edu" method="GET">
            <!-- Email Field -->
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" placeholder="Your email address" required>
        
            <!-- Subject Field -->
            <label for="subject">Subject:</label>
            <input type="text" id="subject" name="subject" placeholder="Subject of your message" required>
        
            <!-- Message Field -->
            <label for="body">Message:</label>
            <textarea id="body" name="body" placeholder="Type your message here" rows="5" cols="40" required></textarea>
        
            <!-- Submit Button -->
            <button type="submit">Send Message</button>
        </form>