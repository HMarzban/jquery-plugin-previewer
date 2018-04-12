$(function () {

    $.fn.drags = function(opt) {

            opt = $.extend({handle:"",cursor:"move"}, opt);
            var $el="";
            if(opt.handle === "") {
                 $el = this;
            } else {
                 $el = this.find(opt.handle);
            }

            return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
                var $drag="";
                if(opt.handle === "") {
                     $drag = $(this).addClass('draggable');
                } else {
                     $drag = $(this).addClass('active-handle').parent().addClass('draggable');
                }
                var z_idx = $drag.css('z-index'),
                    drg_h = $drag.outerHeight(),
                    drg_w = $drag.outerWidth(),
                    pos_y = $drag.offset().top + drg_h - e.pageY,
                    pos_x = $drag.offset().left + drg_w - e.pageX;
                $drag.css('z-index', 1000).parents().on("mousemove", function(e) {
                    $('.draggable').offset({
                        top:e.pageY + pos_y - drg_h,
                        left:e.pageX + pos_x - drg_w
                    }).on("mouseup", function() {
                        $(this).removeClass('draggable').css('z-index', z_idx);
                    });
                });
                e.preventDefault(); // disable selection
            }).on("mouseup", function() {
                if(opt.handle === "") {
                    $(this).removeClass('draggable');
                } else {
                    $(this).removeClass('active-handle').parent().removeClass('draggable');
                }
            });

        };// $.fn.drags 

    $.fn.previewer = function (options) {
        var $this = this;
        /*=========*/
        var defaults = {
            hold_time: 1,
            show_tab: true,
            direction: "ltr",
            sandbox: {
                active: true,
                types: "allow-same-origin allow-scripts"
            },
            show_scroll: false,
            responsive: true,
            style: {
                width: "60%",
                height: "300px",
                radius: " 0 0 0 6px"
            },
            class: "",
            focus: true
        };
        /*=========*/
        var timeoutId = 0;
        var li_width = 0;
        var $title = "";
        var $loged = [];
        var $link = "";
        var $currentID = "";
        /*=========*/

        var $settings = $.extend({}, defaults, options);

        var $ID = function () {
            return 'nd_' + Math.random().toString(36).substr(2, 9);
        };

        $this.find('a').on('click', function (event) {
            event.preventDefault();
        });

        $this.find('a').on('mousedown', function (event) {
            event.preventDefault();
            var _this = $(this);
            /*=========*/
            timeoutId = setTimeout(function () {
                $link = _this.attr("href");
                $title = _this.attr("title") || _this.text() ;
                $currentID = $ID();
                if (jQuery.inArray($title, $loged) == -1) {
                    $loged.push($title);
                    _this.attr('data-id',$currentID);
                    fn_creat_modal();
                    fn_creat_newTabe($link);
                }else{
                    //if this linke was open just open modal then switch to tab
                    $('.modal_previewer').fadeIn();
                    $('.modal_previewer .nd_head [data-id="'+$(_this).data('id')+'"]').trigger('click');
                }
            }, $settings.hold_time);
            /*=========*/
        }).on('mouseup mouseleave', function (event) {
            event.preventDefault();
            clearTimeout(timeoutId);
            // $('.modal_previewer').fadeOut();
        });




        var fn_creat_modal = function (_title) {
            if ($('body').find('.modal_previewer').length == 0)
                $('body').append('<div dir="' + $settings.direction +
                    '" class="modal_previewer ' + $settings.class + ' previewer_' + $settings.direction +' "> <div class="nd_head"> <div class="btn_prevSlide"></div> <div class="btn_nextSlide"></div> <div class="btn_close"></div> <ul></ul></div> <div class="nd_body"></div> <div class="nd_footer"></div> </div>'
                );

            $('.modal_previewer .nd_head ul')
                .append('<li data-id="' + $currentID + '"><span>' + $title + '</span> <b class="btn_closeTabe"></b> </li>');

            if (!$settings.show_tab)
                $('.modal_previewer .nd_head').addClass('hide');

        }; // fn_creat_newTabe

        var fn_creat_newTabe = function (_link) {

            $('.modal_previewer .nd_body > div').hide();

            var sandbox = "";
            if ($settings.sandbox.active)
                sandbox = 'sandbox="' + $settings.sandbox.types + '"';

            $('body')
                .find('.modal_previewer .nd_body')
                .append('<div id="' + $currentID + '"> <iframe src="' + _link + '" ' + sandbox +'></iframe> </div>')
                .find('#' + $currentID).fadeIn();
            //after append all necessary  element show modal
            $('.modal_previewer').fadeIn();

            fn_creat_event_listner();
        }; // fn_creat_newTabe

        var fn_init_focus_desk = function(){
            $('.modal_previewer')
            .mouseleave(function(){
                $this.removeClass('modal_blur');
            })
            .mouseenter(function(){
                $this.addClass('modal_blur');
            });
        };

        var fn_make_scrollHead = function(){
            
            $('.modal_previewer ul li').each(function(index,val){
                li_width += $(val).innerWidth();
            });

            var head_width = $('.modal_previewer .nd_head').innerWidth();
            //TODO: don't forgt for ltr direction change css left to right

            console.log(li_width +"========="+ head_width);
            if(li_width >= head_width ){
                $('.btn_prevSlide,.btn_nextSlide').fadeIn();
                $('.btn_close').addClass('active');
                
            }else{
                $('.btn_prevSlide,.btn_nextSlide').fadeOut();
                $('.btn_close').removeClass('active');
            } 
        };

        var fn_init_style = function () {
            $this.after(
                `<style>   
                .modal_blur { 
                transition: all .2s ease-in-out; 
                -webkit-filter: blur(2px); 
                -moz-filter: blur(2px); 
                -o-filter: blur(2px);
                -ms-filter: blur(2px); 
                filter: blur(2px); 
                }
                .modal_previewer{
                    width: ${$settings.style.width};height:${$settings.style.height};display: none;
                    border-radius: 4px;background-color: #fff;
                    position: fixed;top:50%;left: 50%;
                    transform: translate(-50%,-50%);
                    /*box-shadow: 1px 1px 10px rgba(0,0,0,.4);*/font-family: tahoma;
                    /*border:1px solid  rgba(0,0,0,.4);overflow: hidden;*/
                    -webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;
                }  
                .modal_previewer *{-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;}
                .modal_previewer a{    text-decoration: none;color: black;font-size: .9em;font-weight: normal;}
                /*=====================*/
                .modal_previewer ul{
                    list-style-type: none;
                    padding: 0;
                    margin: 0;
                    width: 100%;
                    list-style-type: none;    
                    position: relative;
                    padding: 0 30px;    
                    transition: all 0.3s;
                    margin: 0;
                    width: 1000%;
                    overflow: hidden;    
                }
                .modal_previewer ul li{
                    float: left;
                    padding: 6px 25px;
                    background: #f0f0f2;
                    border-radius: 5px 6px 0 0;
                    border: 1px solid #aaa;
                    border-bottom: 0;position: relative;
                    z-index:1;cursor: pointer;
                }
                .modal_previewer ul li.active{
                    z-index:2
                }
                /*=====================*/
                .modal_previewer.previewer_rtl{direction: rtl;text-align: right;}
               /* .modal_previewer.previewer_rtl ul li > span{
                    background-color: #f0f0f2;
                    position: absolute;
                    height: 141%;
                    width: 21px;
                    left: -11px;
                    top: 0;
                    border-left: 1px solid #8c8a8a;
                    transform: rotate(25deg);
                    border-radius: 6px 0 0 0;
                }*/
                .modal_previewer ul li span::after{
                    content: '';display: block;
                    background-color: #f0f0f2;
                    position: absolute;
                    height: 141%;
                    width: 21px;
                    left: -11px;
                    top: 0;
                    border-left: 1px solid #8c8a8a;
                    transform: rotate(26deg);
                    border-radius: 8px 0 0 0;
                }
                .modal_previewer ul li span::before{
                    content: '';display: block;
                    background-color: #f0f0f2;
                    position: absolute;
                    height: 141%;
                    width: 21px;
                    right: -11px;
                    top: 0;
                    border-right: 1px solid #8c8a8a;
                    transform: rotate(-26deg);
                    border-radius: 10px 7px 0 0;
                }
                /*====================*/
                .modal_previewer .nd_head{
                    position: absolute;top: -32px;left: 0;width: 100%;z-index: 2; 
                    padding:0 6px;overflow: hidden;background: #2196F3;    border-radius: 6px 6px 0 0;
                }
                .modal_previewer .nd_head.hide{
                    display:none;
                }
                .modal_previewer .nd_body{
                    overflow: hidden;width: 100%;height: 100%;position: relative;
                    border: 1px solid #aaa;
                    border-radius:0 0 6px 6px;
                }
                iframe{
                    width: 100%;height: 100%;overflow: hidden;position: absolute;top: 0;
                    left: 0;z-index: 1;border: none;border-radius:0 0 6px 6px};
                }
            
            </style>`
            );


        }; // fn_init_style
        
        fn_init_style();

        var fn_creat_event_listner = function(){

            //close modal // fadeOut
            $('.modal_previewer .nd_head  .btn_close').on('click',function(){
                $('.modal_previewer').fadeOut();
            });
            /*======*/
            var _direction = $settings.direction == 'rtl'? 'left':'right';
            var _tabSlide_prev =  $settings.direction == 'rtl'? '.btn_prevSlide':'.btn_nextSlide';
            var _tabSlide_next =  $settings.direction == 'rtl'? '.btn_nextSlide':'.btn_prevSlide';
            $(_tabSlide_prev).on('click',function(){
                var current = parseInt($('.modal_previewer ul').css(_direction));
                $('.modal_previewer ul').css(_direction,(current+60)+"px"); 
            });
            /*======*/
            $(_tabSlide_next).on('click',function(){
                var current = parseInt($('.modal_previewer ul').css(_direction));
                if(current > 0){ 
                    if(current-60 < 0){
                        $('.modal_previewer ul').css(_direction,'0');
                    }else{
                        $('.modal_previewer ul').css(_direction,(current-60)+"px"); 
                    }
                }else{
                    $('.modal_previewer ul').css(_direction,'0');
                }
            });
            /*======*/
            // click tab
            $(document).on('click', '.modal_previewer .nd_head ul li', function (e) {
                 // if click close button = = otherwise change tab view
                  if($(e.target).hasClass('btn_closeTabe')){
                     var $tab_id = $(e.target).parent().data('id');
                     var $title = $(e.target).parent().find('span').text();
              
                     // remove loged Id
                     var $index = $loged.indexOf($title);
                     if ($index !== -1) {
                         $loged.splice($index, 1);
                     }
                     //TODO: find way to remove .modal_previewer then remove tab for ux & ui 
                     if($loged.length == 0){
                         $this.removeClass('modal_blur');
                         $('.modal_previewer').fadeOut('fast');
                     }
                     
                     if( $(this).prev().text().length === 0 ){                   
                         var nextId = $(e.target).parent().next().data('id');
                         $(".modal_previewer .nd_body").find('#'+nextId).fadeIn();
                     }else{ 
                         var prevId = $(e.target).parent().prev().data('id');
                         $(".modal_previewer .nd_body").find('#'+prevId).fadeIn();
                     }

                      $(".modal_previewer .nd_body").find('#'+$tab_id).remove();
                      $(e.target).parent().remove();

                  }else{
                     var _id = $(this).data('id');
                     $('.modal_previewer .nd_head ul li').removeClass('active');
                     $(this).addClass('active');
                     $('.modal_previewer .nd_body > div').hide();
                     $('.modal_previewer .nd_body > div#' + _id).show();
                  }
               
              });// btn tab handler
              /*======*/
              // make dragable box
              $('.modal_previewer').drags();
              /*======*/
              // if we are in desktop and focus is enable
              // FIXME: cheack if is in desktop
              if($settings.focus)
                fn_init_focus_desk();
              /*======*/
              fn_make_scrollHead();
              /*======*/  
        };// fn_creat_event_listner


    }; // plugin 

    

});
