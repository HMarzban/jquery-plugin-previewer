

previewer.js
=============

Simple Jquery Plugin for preview link in your page. This Jquery plugin required for <a href="https://fanavard.com/" title="Fanavard">Fanavard</a> competition  UI Develop. 


# How to use

Add these tow file in header or footer of html file; before import `previewer.js` import <a href="https://code.jquery.com/" title="JQuery">JQuery</a>

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
hold_time   | 1000                                                      | milliseconds
show_tab    | true                                                      | boolean
direction   | "ltr"                                                     | "LTR" || "RTL"
sandbox     | `active: true,types: "allow-same-origin allow-scripts`    | `active:boolean, [types: Ifame types](https://www.w3schools.com/tags/att_iframe_sandbox.asp)`
tab_Navigate| true                                                      | boolean
style       | `width: "60%",height: "300px"`                           | `[width: px / % / em / vw ...,height: px / % / em / vh ...](https://www.w3schools.com/cssref/css_units.asp)`
class       | ""                                                        | css class name
focus       | true                                                      | boolean
dragable    | false                                                     | boolean

# jquery-plugin-previewer
JQUERY Plugin - Modal Previewer - Linke Previewer 






