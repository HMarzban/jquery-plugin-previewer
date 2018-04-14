    (function( factory ) {
        if ( typeof define === "function" && define.amd ) {
    
            // AMD. Register as an anonymous module.
            define([ "previewer" ], factory );
        } else {
    
            // Browser globals
            factory( jQuery );
        }
    }(function( $ ) {

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
        }; // $.fn.drags 
    
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
                        $('.modal_previewer').fadeIn();
                        $('.modal_previewer .nd_head [data-id="' + $(_this).data('id') + '"]').trigger('click');
                    }
                }, $settings.hold_time);
                /*=========*/
            }).on($mouse_leave, function (event) {
                event.preventDefault();
                clearTimeout(timeoutId);
                // $('.modal_previewer').fadeOut();
            });
    
            var fn_creat_modal = function (_title) {
                if ($('body').find('.modal_previewer').length == 0)
                    $('body').append('<div dir="' + $settings.direction +
                        '" class="modal_previewer ' + $settings.class + ' previewer_' + $settings.direction + ' " style="width:'+$settings.style.width+';height:'+$settings.style.height+'"> <div class="nd_head"> <div class="btn_prevSlide"></div> <div class="btn_nextSlide"></div> <div class="btn_close"></div> <ul></ul></div> <div class="nd_body"></div> <div class="nd_footer"></div> </div>'
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
                    .append('<div id="' + $currentID + '"> <iframe src="' + _link + '" ' + sandbox + '></iframe> </div>')
                    .find('#' + $currentID).fadeIn();
                //after append all necessary  element show modal
                $('.modal_previewer').fadeIn();
    
                fn_creat_event_listner();
            }; // fn_creat_newTabe
    
            var fn_init_focus_desk = function () {
                $('.modal_previewer')
                    .mouseleave(function () {
                        $this.removeClass('modal_blur');
                    })
                    .mouseenter(function () {
                        $this.addClass('modal_blur');
                    });
            };
    
            var fn_make_scrollHead = function () {
    
                $('.modal_previewer ul li').each(function (index, val) {
                    li_width += $(val).innerWidth();
                });
    
                var head_width = $('.modal_previewer .nd_head').innerWidth();
                //TODO: don't forgt for ltr direction change css left to right
    
                console.log(li_width + "=========" + head_width);
                if (li_width >= head_width) {
                    $('.btn_prevSlide,.btn_nextSlide').fadeIn();
                    $('.btn_close').addClass('active');
    
                } else {
                    $('.btn_prevSlide,.btn_nextSlide').fadeOut();
                    $('.btn_close').removeClass('active');
                }
            };
            var fn_creat_event_listner = function () {
    
                //close modal // fadeOut
                $('.modal_previewer .nd_head  .btn_close').on($click_event, function () {
    
                    $('.modal_previewer').fadeOut(function () {
                        $this.removeClass('modal_blur');
                    });
    
                });
                /*======*/
                var _direction = $settings.direction == 'rtl' ? 'left' : 'right';
                var _tabSlide_prev = $settings.direction == 'rtl' ? '.btn_prevSlide' : '.btn_nextSlide';
                var _tabSlide_next = $settings.direction == 'rtl' ? '.btn_nextSlide' : '.btn_prevSlide';
                $(_tabSlide_prev).on($click_event, function () {
                    var current = parseInt($('.modal_previewer ul').css(_direction));
                    $('.modal_previewer ul').css(_direction, (current + 60) + "px");
                });
                /*======*/
                $(_tabSlide_next).on($click_event, function () {
                    var current = parseInt($('.modal_previewer ul').css(_direction));
                    if (current > 0) {
                        if (current - 60 < 0) {
                            $('.modal_previewer ul').css(_direction, '0');
                        } else {
                            $('.modal_previewer ul').css(_direction, (current - 60) + "px");
                        }
                    } else {
                        $('.modal_previewer ul').css(_direction, '0');
                    }
                });
                /*======*/
                // click tab
                $(document).on($click_event, '.modal_previewer .nd_head ul li', function (e) {
                    // if click close button = = otherwise change tab view
                    if ($(e.target).hasClass('btn_closeTabe')) {
                        var $tab_id = $(e.target).parent().data('id');
                        var $title = $(e.target).parent().find('span').text();
    
                        // remove loged Id
                        var $index = $loged.indexOf($title);
                        if ($index !== -1) {
                            $loged.splice($index, 1);
                        }
                        //TODO: find way to remove .modal_previewer then remove tab for ux & ui 
                        if ($loged.length == 0) {
                            $this.removeClass('modal_blur');
                            $('.modal_previewer').fadeOut('fast');
                        }
    
                        if ($(this).prev().text().length === 0) {
                            var nextId = $(e.target).parent().next().data('id');
                            $(".modal_previewer .nd_body").find('#' + nextId).fadeIn();
                        } else {
                            var prevId = $(e.target).parent().prev().data('id');
                            $(".modal_previewer .nd_body").find('#' + prevId).fadeIn();
                        }
    
                        $(".modal_previewer .nd_body").find('#' + $tab_id).remove();
                        $(e.target).parent().remove();
    
                    } else {
                        var _id = $(this).data('id');
                        $('.modal_previewer .nd_head ul li').removeClass('active');
                        $(this).addClass('active');
                        $('.modal_previewer .nd_body > div').hide();
                        $('.modal_previewer .nd_body > div#' + _id).show();
                    }
    
                }); // btn tab handler
                /*======*/
                // make dragable box
                $('.modal_previewer').nd_drags();
                /*======*/
                // if we are in desktop and focus is enable
                // FIXME: cheack if is in desktop
                if ($settings.focus)
                    fn_init_focus_desk();
                /*======*/
                fn_make_scrollHead();
                /*======*/
    
            }; // fn_creat_event_listner
        }; // $.fn.previewer 
    
    }));