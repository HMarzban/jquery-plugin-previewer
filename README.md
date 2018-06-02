
previewer.js
=============

Simple Jquery Module Plugin for preview link in your page. 
This Jquery plugin open hyperlink in your website page on pops up modal, the user can open multi hyperlinks on one modal and manage them by tabs order. Test plugin now on the demo page.

<a href="https://github.com/HosseinMarzban/jquery-plugin-previewer/tree/master/demo" title="Demo previewer.js">DEMO</a>


# How to use

Add these two files in Header or Footer of your html file, Be careful before import `previewer.js` import <a href="https://code.jquery.com/" title="JQuery">JQuery</a> or <a href="http://requirejs.org/" title="requirejs">requirejs</a> base on you need.

``` html
<link href="../css/style.css"  rel=stylesheet>
<script src="../js/previewer.js"></script>
```


### JQUERY

``` javascript
$('.contentWraper').previewer(..option..);
```

### AMD, REQUIREJS

``` javascript
requirejs.config({
    paths: {
        jquery: '../node_modules/jquery/dist/jquery.min',
        previewer:'../js/previewer'
    }
});


requirejs(['jquery','previewer'], function( $ ) {
    $('.contentWraper').previewer(..option..);
});
```

# Features

``` javascript
$('.contentWraper').previewer({
        direction:'rtl',
        hold_time: 2000,
        dragable: false,
        sandbox: {
            active: true,
            types: "allow-same-origin allow-scripts"
        }
    });
```

### Options

Option      | Default                                                   | Acceptable
---         | ---                                                       | ---
hold_time   | 1000                                                      | Milliseconds
show_tab    | true                                                      | Boolean
direction   | ltr                                                       | `LTR or RTL`
sandbox     | `active: true,types: "allow-same-origin allow-scripts`    | `active:boolean,types:`[Iframe Attribute](https://www.w3schools.com/tags/att_iframe_sandbox.asp)
tab_Navigate| true                                                      | Boolean
style       | `width: "60%",height: "300px"`                            | [width: px / % / vw  ,  height: px / % / vh ](https://www.w3schools.com/cssref/css_units.asp)
class       | ""                                                        | CSS Class Name string
focus       | true                                                      | Boolean
dragable    | false                                                     | Boolean







# jquery-plugin-previewer
JQUERY Plugin - Modal Previewer - Linke Previewer 

