(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["jquery"], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

        $.fn.nd_drags = function (opt) {
            opt = $.extend({
                handle: "",
                cursor: "move"
            }, opt);
            var $el = "";
            if (opt.handle === "") {
                $el = this;
            } else {
                $el = this.find(opt.handle);
            }
            return $el.css('cursor', opt.cursor).on("mousedown", function (e) {
                var $drag = "";
                if (opt.handle === "") {
                    $drag = $(this).addClass('draggable');
                } else {
                    $drag = $(this).addClass('active-handle').parent().addClass('draggable');
                }
                var z_idx = $drag.css('z-index'),
                    drg_h = $drag.outerHeight(),
                    drg_w = $drag.outerWidth(),
                    pos_y = $drag.offset().top + drg_h - e.pageY,
                    pos_x = $drag.offset().left + drg_w - e.pageX;
                $drag.css('z-index', 1000).parents().on("mousemove", function (e) {
                    $('.draggable').offset({
                        top: e.pageY + pos_y - drg_h,
                        left: e.pageX + pos_x - drg_w
                    }).on("mouseup", function () {
                        $(this).removeClass('draggable').css('z-index', z_idx);
                    });
                });
                e.preventDefault(); // disable selection
            }).on("mouseup", function () {
                if (opt.handle === "") {
                    $(this).removeClass('draggable');
                } else {
                    $(this).removeClass('active-handle').parent().removeClass('draggable');
                }
            });
        };// $.fn.drags 
    
        $.fn.previewer = function (options) {
            function is_touch_device() {
                return !!('ontouchstart' in window);
            }
            var $this = this;
            var $click_event = is_touch_device() ? "touchstart" : "click";
            var $mouse_event = is_touch_device() ? "touchstart" : "mousedown";
            var $mouse_leave = is_touch_device() ? "touchend touchcancel" : "mouseup mouseleave";

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
                focus: true,
                dragable: false,
            };
            /*=========*/
            var timeoutId = 0;
            var $title = "";
            var $loged = [];
            var $link = "";
            var $currentID = "";
            var flag_event_bind = false;
            /*=========*/
            var $settings = $.extend({}, defaults, options);
    
            var $ID = function () {
                return 'nd_' + Math.random().toString(36).substr(2, 9);
            };

            //DOM & fn Cache 
            var modal = {
                $root : "",
                $body : function(){ return this.$root.find('.nd_body'); },
                $head : function(){ return this.$root.find('.nd_head'); },
                _show:function(_fn){
                    this.$root.fadeIn(_fn);
                },
                _hide:function(_fn){
                   this.$root.fadeOut(_fn);
                }
            };

            $this.find('a').on('touchstart click', function (event) {
                event.preventDefault();
            });
    
            $this.find('a').on($mouse_event, function (event) {
                event.preventDefault();
                var _this = $(this);
                /*=========*/
                timeoutId = setTimeout(function () {
                    $link = _this.attr("href");
                    $title = _this.attr("title") || _this.text();
                    $currentID = $ID();
                    if (jQuery.inArray($title, $loged) == -1) {
                        $loged.push($title);
                        _this.attr('data-id', $currentID);
                        fn_creat_modal();
                        fn_creat_newTabe($link);
                    } else {
                        //if this linke was open just open modal then switch to tab
                        modal._show();
                        modal.$root.find('.nd_head [data-id="' + $(_this).data('id') + '"]').trigger('click')
                    }
                }, $settings.hold_time);
                /*=========*/
            }).on($mouse_leave, function (event) {
                event.preventDefault();
                clearTimeout(timeoutId);
                // modal.$root.fadeOut();
            });
    
            var fn_creat_modal = function (_title) {
                if (modal.$root.length == 0)
                    $('body').append('<div dir="' + $settings.direction +
                        '" class="modal_previewer ' + $settings.class + ' previewer_' + $settings.direction + ' " style="width:'+$settings.style.width+';height:'+$settings.style.height+'"> <div class="nd_head"> <div class="btn_prevSlide"></div> <div class="btn_nextSlide"></div> <div class="btn_close"></div> <ul></ul></div> <div class="nd_body"></div> <div class="nd_footer"></div> </div>'
                    );

                modal.$root = $('body .modal_previewer');
                modal.$head().find('ul')
                    .append('<li data-id="' + $currentID + '"><span>' + $title + '</span> <b class="btn_closeTabe"></b> </li>');
    
                if (!$settings.show_tab)
                   modal.$head().addClass('hide');

                   fn_make_scrollHead();
                    
            }; // fn_creat_newTabe
    
            var fn_creat_newTabe = function (_link) {
                //first hide all tab data
                modal.$body().find('> div').hide();
                var sandbox = "";
                if ($settings.sandbox.active)
                    sandbox = 'sandbox="' + $settings.sandbox.types + '"';
                    modal.$body()
                        .append('<div id="' + $currentID + '"> <iframe src="' + _link + '" ' + sandbox + '></iframe> </div>')
                        .find('#' + $currentID).fadeIn();
                //after append all necessary  element show modal
                modal._show();
                
                fn_bind_event_listner();
            }; // fn_creat_newTabe
    
            var fn_init_focus_desk = function () {
                modal.$root
                    .mouseleave(function () {
                        $this.removeClass('modal_blur');
                    })
                    .mouseenter(function () {
                        $this.addClass('modal_blur');
                    });
            };
    
            var fn_make_scrollHead = function () {
                var li_width = 0;
                    $('.modal_previewer ul li').each(function (index, val) {
                        li_width += $(val).innerWidth() + 70;
                    });
               

                    var head_width = modal.$head().innerWidth();
                    //TODO: don't forgt for ltr direction change css left to right
        
                    if (li_width >= head_width) {
                        $('.btn_prevSlide,.btn_nextSlide').fadeIn();
                        $('.btn_close').addClass('active');
        
                    } else {
                        $('.btn_prevSlide,.btn_nextSlide').fadeOut();
                        $('.btn_close').removeClass('active');
                    } 
            };

            var fn_bind_event_listner = function () {

                var _direction     = $settings.direction == 'rtl' ? 'left' : 'right';
                var _tabSlide_prev = $settings.direction == 'rtl' ? '.btn_prevSlide' : '.btn_nextSlide';
                var _tabSlide_next = $settings.direction == 'rtl' ? '.btn_nextSlide' : '.btn_prevSlide';

                //event handler
                $('.modal_previewer .nd_head  .btn_close').on($click_event,fn_ev_closeBTN);// close tab handler
                $(_tabSlide_prev).on($click_event, fn_ev_tabslide_prev);
                $(_tabSlide_next).on($click_event, fn_ev_tabslide_next);
                $(document).on($click_event, '.modal_previewer .nd_head ul li',fn_ev_tabTBN); // btn tab handler
                /*======*/
                function fn_ev_closeBTN () {
                    
                    modal._hide(function () {
                        $this.removeClass('modal_blur');
                    });
                }
                function fn_ev_tabslide_prev () {
                    var current = parseInt(modal.$head().find('ul').css(_direction));
                    if (current > 0) {
                        if (current - 60 < 0) {
                            modal.$head().find('ul').css(_direction, '0');
                        } else {
                            modal.$head().find('ul').css(_direction, (current - 60) + "px");
                        }
                    } else {
                        modal.$head().find('ul').css(_direction, '0');
                    }
                }
                function fn_ev_tabslide_next () {
                    var current = parseInt(modal.$head().find('ul').css(_direction));
                    modal.$head().find('ul').css(_direction, (current + 60) + "px");
                }   
                function fn_ev_tabTBN (event){
                    
                     // if click close button = = otherwise change tab view
                     if ($(event.target).hasClass('btn_closeTabe')) {
                        var $tab_id = $(event.target).parent().data('id');
                        var $title = $(event.target).parent().find('span').text();
    
                        // remove loged Id
                        var $index = $loged.indexOf($title);
                        if ($index !== -1) {
                            $loged.splice($index, 1);
                        }
                        //TODO: find way to remove .modal_previewer then remove tab for ux & ui 
                        if ($loged.length == 0) {
                            $this.removeClass('modal_blur');
                            modal._hide('fast');
                        }
    
                        if ($(this).prev().text().length === 0) {
                            var nextId = $(event.target).parent().next().data('id');
                            modal.$body().find('#' + nextId).fadeIn();
                        } else {
                            var prevId = $(event.target).parent().prev().data('id');
                            modal.$body().find('#' + prevId).fadeIn();
                        }
    
                        modal.$body().find('#' + $tab_id).remove();
                        $(event.target).parent().remove();

                        fn_make_scrollHead();
                    } else {
                        //change tab view
                        var _id = $(this).data('id');
                        modal.$head().find('ul li').removeClass('active');
                        $(this).addClass('active');
                        modal.$body().find('> div').hide();
                        modal.$body().find('> div#' + _id).show();
                    }

                   
                }
               
                /*======*/
                // make dragable box
                if($settings.dragable)
                    modal.$root.nd_drags();
                /*======*/
                // if we are in desktop and focus is enable
                // FIXME: cheack if is in desktop
                if ($settings.focus)
                    fn_init_focus_desk();
                
                /*======*/

    
            }; // fn_creat_event_listner
        }; // $.fn.previewer 
    
        //TODO: make event listener better structure for memory leak.
        //TODO: make DOM selection for better memory leak.
    }));