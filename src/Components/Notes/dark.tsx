export const darkCss = `@media print {
  *,
  *:before,
  *:after {
    background: transparent !important;
    color: #000 !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }

  a,
  a:visited {
    text-decoration: underline;
  }

  a[href]:after {
    content: " (" attr(href) ")";
  }

  abbr[title]:after {
    content: " (" attr(title) ")";
  }

  a[href^="#"]:after,
  a[href^="javascript:"]:after {
    content: "";
  }

  pre,
  blockquote {
    border: 1px solid #999;
    page-break-inside: avoid;
  }

  thead {
    display: table-header-group;
  }

  tr,
  img {
    page-break-inside: avoid;
  }

  img {
    max-width: 100% !important;
  }

  p,
  h2,
  h3 {
    orphans: 3;
    widows: 3;
  }

  h2,
  h3 {
    page-break-after: avoid;
  }
}

html {
  font-size: 10px;
}

@media screen and (min-width: 32rem) and (max-width: 48rem) {
  html {
    font-size: 15px;
  }
}

@media screen and (min-width: 48rem) {
  html {
    font-size: 16px;
  }
}

p,
.air-p {
  font-size: 1rem;
  margin-bottom: 1.3rem;
}

h1,
.air-h1,
h2,
.air-h2,
h3,
.air-h3,
h4,
.air-h4 {
  margin: 1.414rem 0 .5rem;
  font-weight: inherit;
  line-height: 1.42;
}

  h1,
  .air-h1 {
    margin-top: 0;
    font-size: 2.8rem;
  }
  
  h2,
  .air-h2 {
    font-size: 2.2rem;
  }
  
  h3,
  .air-h3 {
    font-size: 1.799rem;
  }
  
  h4,
  .air-h4 {
    font-size: 1.414rem;
  }
  
  h5,
  .air-h5 {
    font-size: 1.121rem;
  }
  
  h6,
  .air-h6 {
    font-size: .88rem;
  }
  
  small,
  .air-small {
    font-size: .707em;
  }
/* https://github.com/mrmrs/fluidity */

img,
canvas,
iframe,
video,
svg,
select,
textarea {
  max-width: 100%;
}

@import url(http://fonts.googleapis.com/css?family=Open+Sans:300italic,300);

body {
  color: white;
  line-height: 1.6;
  background-color: #202020;
  font-family: 'Open Sans', Helvetica, sans-serif;
  font-weight: 300;
  margin: 1rem auto 1rem;
  max-width: 48rem;
  text-align: center;
  // -webkit-touch-callout: none;
  // -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

img {
  border-radius: 50%;
  height: 200px;
  margin: 0 auto;
  width: 200px;
}

a,
a:visited {
  color: #3498db;
}

a:hover,
a:focus,
a:active {
  color: #2980b9;
}

pre {
  background-color: #303030;
  padding: 1rem;
  text-align: left;
  color: white;
}

blockquote {
  margin: 0;
  border-left: 5px solid #7a7a7a;
  font-style: italic;
  padding: 1.33em;
  text-align: left;
}

ul,
ol,
li {
  text-align: left;
}

p {
  color: #white;
}`