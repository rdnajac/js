# JS - JavaScript Repository

This repository hosts JavaScript files intended for use across different web
projects without needing to duplicate code.

## What is a CDN?

A Content Delivery Network (CDN) is a network of servers that deliver content
(such as JavaScript files, images, and stylesheets) from locations closer to the
end-user, reducing load time. CDNs help improve website performance and
scalability.

## Using jsDelivr to Access JavaScript Files

[jsDelivr](https://www.jsdelivr.com/) is a free CDN that serves files directly
from GitHub repositories. By hosting your JavaScript files in this GitHub repo,
you can access them via jsDelivr without needing to store the files in each
project’s repository.

### How to Use jsDelivr in Your HTML Pages

To use a JavaScript file from this repo, add a `<script>` tag in your HTML file
pointing to the jsDelivr URL for the specific file. Here's the format:

```html
<script src="https://cdn.jsdelivr.net/gh/your-username/js/your-file.js"></script>
```

- Replace `your-username` with your GitHub username.
- Replace `your-file.js` with the specific JavaScript filename you want to use.

Example:

If you have a file `example.js` in this repository, you can include it as
follows:

```html
<script src="https://cdn.jsdelivr.net/gh/your-username/js/example.js"></script>
```

### Benefits of Using jsDelivr

- **Reduced File Duplication**: Host your JavaScript code in a central place and
  reference it in multiple projects.
- **Improved Load Times**: jsDelivr serves files from the closest server to the
  user, speeding up load times.
- **Automatic Updates**: If you update your JavaScript files in this repository,
  the updates are instantly available to all sites referencing the files.

## Repository Structure

Add your JavaScript files to this repository and use the jsDelivr URL format
above to access them in your HTML pages.
