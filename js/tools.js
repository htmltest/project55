(function($) {

    $(document).ready(function() {

        $('.side-link').click(function(e) {
            $('body').toggleClass('hidden-menu');
            myMap.container.fitToViewport();
            e.preventDefault();
        });

        $('body').on('click', '.order-link', function(e) {
            $.ajax({
                type: 'POST',
                url: $(this).attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                if ($('.window').length > 0) {
                    windowClose();
                }
                windowOpen(html);
            });
            e.preventDefault();
        });

        $.extend($.validator.messages, {
            required: 'Не заполнено поле',
            email: 'Введен некорректный e-mail'
        });

        $('body').on('click', '.message-error-back-link', function(e) {
            $(this).parents().filter('.message-error').remove();
            e.preventDefault();
        });

        $('.callback-link').click(function(e) {
            $('.callback').toggle();
            $('.callback').find('.loading, .message-error, .message-success').remove();
            $('.callback .form-input input').val('');
            e.preventDefault();
        });

        $('.callback-close').click(function(e) {
            $('.callback').hide();
            e.preventDefault();
        });

        $('.map-callback').click(function(e) {
            $('.callback').show();
            $('.callback').find('.loading, .message-error, .message-success').remove();
            $('.callback .form-input input').val('');
            e.preventDefault();
        });

        $('input.maskPhone').mask('+7 (999) 999-99-99');

        $('.form-select select').chosen({disable_search: true, no_results_text: 'Нет результатов'});
        $(window).resize(function() {
            $('.form-select select').chosen('destroy');
            $('.form-select select').chosen({disable_search: true, no_results_text: 'Нет результатов'});
        });

        $('.form-checkbox span input:checked').parent().parent().addClass('checked');
        $('.form-checkbox').click(function() {
            $(this).toggleClass('checked');
            $(this).find('input').prop('checked', $(this).hasClass('checked')).trigger('change');
        });

        $('.form-radio span input:checked').parent().parent().addClass('checked');
        $('.form-radio').click(function() {
            var curName = $(this).find('input').attr('name');
            $('.form-radio input[name="' + curName + '"]').parent().parent().removeClass('checked');
            $(this).addClass('checked');
            $(this).find('input').prop('checked', true).trigger('change');
        });

        $('form').each(function() {
            if ($(this).hasClass('ajaxForm')) {
                $(this).validate({
                    submitHandler: function(form) {
                        $(form).append('<div class="loading"><div class="loading-text">Отправка данных</div></div>');
                        $.ajax({
                            type: 'POST',
                            url: $(form).attr('action'),
                            data: $(form).serialize(),
                            dataType: 'html',
                            cache: false
                        }).done(function(html) {
                            $(form).find('.loading').remove();
                            $(form).append(html);
                        });
                    }
                });
            } else {
                $(this).validate();
            }
        });

        $('.plans-rooms a').click(function(e) {
            var curLi = $(this).parent();
            if (!curLi.hasClass('active')) {
                $('.plans-rooms li.active').removeClass('active');
                curLi.addClass('active');

                var curIndex = $('.plans-rooms li').index(curLi);
                $('.plans-rooms-tab.active').removeClass('active');
                $('.plans-rooms-tab').eq(curIndex).addClass('active');
            }
            e.preventDefault();
        });

        $('.plans-types a').click(function(e) {
            var curLi = $(this).parent();
            if (!curLi.hasClass('active')) {
                var curBlock = curLi.parents().filter('.plans-rooms-tab');

                curBlock.find('.plans-types li.active').removeClass('active');
                curLi.addClass('active');

                var curIndex = curBlock.find('.plans-types li').index(curLi);
                curBlock.find('.plans-types-tab.active').removeClass('active');
                curBlock.find('.plans-types-tab').eq(curIndex).addClass('active');
            }
            e.preventDefault();
        });

        $('.cocoen').each(function() {
            $(this).cocoen();
        });

        $('.webcam-slider').each(function() {
            var curSlider = $(this);
            curSlider.data('curIndex', 0);
            curSlider.data('disableAnimation', true);
            var curHTML = '';
            var i = 1;
            curSlider.find('.webcam-slider-content li').each(function() {
                curHTML += '<a href="#">' + i + '</a>';
                i++;
            });
            $('.webcam-slider-ctrl-list').html(curHTML);
            $('.webcam-slider-ctrl-list a:first').addClass('active');
        });

        $('.webcam-slider').on('click', '.webcam-slider-ctrl-list a', function(e) {
            if (!$(this).hasClass('active')) {
                var curSlider = $('.webcam-slider');
                if (curSlider.data('disableAnimation')) {
                    var curIndex = curSlider.data('curIndex');
                    var newIndex = $('.webcam-slider-ctrl-list a').index($(this));

                    curSlider.data('curIndex', newIndex);
                    curSlider.data('disableAnimation', false);

                    curSlider.find('.webcam-slider-content > ul > li').eq(curIndex).css({'z-index': 2});
                    curSlider.find('.webcam-slider-content > ul > li').eq(newIndex).css({'z-index': 1, 'left': 0, 'top': 0}).show();

                    curSlider.find('.webcam-slider-ctrl-list a.active').removeClass('active');
                    curSlider.find('.webcam-slider-ctrl-list a').eq(newIndex).addClass('active');

                    curSlider.find('.webcam-slider-content > ul > li').eq(curIndex).fadeOut(function() {
                        curSlider.data('disableAnimation', true);
                    });
                }
            }

            e.preventDefault();
        });

        $('.gallery').each(function() {
            var curBlock = $(this);

            $(window).load(function() {
                if (curBlock.find('.gallery-periods-inner ul').width() > curBlock.find('.gallery-periods-inner').width()) {
                    curBlock.find('.gallery-periods-next').css({'display': 'block'});
                }

                var startHTML = curBlock.find('.gallery-content ul').html();
                var i = 0;
                curBlock.find('.gallery-content li').each(function() {
                    $(this).attr('curid', i++);
                });
                curBlock.find('.gallery-content ul').prepend(startHTML);
                curBlock.find('.gallery-content ul').append(startHTML);
            });

            $(window).bind('load resize', function() {
                var curIndex = curBlock.find('.gallery-preview li').index(curBlock.find('.gallery-preview li.active'));
                var curLeft = 0;
                var newIndex = -1;
                curBlock.find('.gallery-content li').each(function() {
                    var curItem = $(this);
                    curLeft -= curItem.width();
                    if (curItem.attr('curid')) {
                        newIndex++;
                        if (curIndex == newIndex) {
                            return false;
                        }
                    }
                });
                curLeft += curBlock.find('.gallery-content li').eq(newIndex).width() / 2;
                curLeft += curBlock.find('.gallery-content').width() / 2;
                curBlock.find('.gallery-content ul').css({'left': curLeft});
                var sideWidth = (curBlock.find('.gallery-content').width() - curBlock.find('.gallery-content li').eq(newIndex).width()) / 2;
                if (sideWidth < 0) {
                    sideWidth = 0;
                }
                curBlock.find('.gallery-prev, .gallery-next').width(sideWidth);
            });

            curBlock.find('.gallery-next').click(function(e) {
                var curIndex = curBlock.find('.gallery-preview li').index(curBlock.find('.gallery-preview li.active'));
                curIndex++;
                if (curIndex >= curBlock.find('.gallery-preview li').length) {
                    curIndex = 0;
                }
                curBlock.find('.gallery-preview li').eq(curIndex).find('a').click();
                e.preventDefault();
            });

            curBlock.find('.gallery-prev').click(function(e) {
                var curIndex = curBlock.find('.gallery-preview li').index(curBlock.find('.gallery-preview li.active'));
                curIndex--;
                if (curIndex < 0) {
                    curIndex = curBlock.find('.gallery-preview li').length - 1;
                }
                curBlock.find('.gallery-preview li').eq(curIndex).find('a').click();
                e.preventDefault();
            });

            curBlock.find('.gallery-preview a').click(function(e) {
                var curLi = $(this).parent();
                if (!curLi.hasClass('active')) {
                    var curIndex = curBlock.find('.gallery-preview li').index(curLi);

                    curBlock.find('.gallery-preview li.active').removeClass('active');
                    curLi.addClass('active');

                    curBlock.find('.gallery-content ul').stop(true, true);
                    curBlock.find('.gallery-prev, .gallery-next').stop(true, true);

                    var curLeft = 0;
                    var newIndex = -1;
                    curBlock.find('.gallery-content li').each(function() {
                        var curItem = $(this);
                        curLeft -= curItem.width();
                        if (curItem.attr('curid')) {
                            newIndex++;
                            if (curIndex == newIndex) {
                                return false;
                            }
                        }
                    });
                    curLeft += curBlock.find('.gallery-content li').eq(newIndex).width() / 2;
                    curLeft += curBlock.find('.gallery-content').width() / 2;
                    curBlock.find('.gallery-content ul').animate({'left': curLeft});
                    var sideWidth = (curBlock.find('.gallery-content').width() - curBlock.find('.gallery-content li').eq(newIndex).width()) / 2;
                    if (sideWidth < 0) {
                        sideWidth = 0;
                    }
                    curBlock.find('.gallery-prev, .gallery-next').animate({'width': sideWidth});
                }
                e.preventDefault();
            });

            curBlock.find('.gallery-periods-next a').click(function(e) {
                var curBlock = $(this).parents().filter('.gallery');

                curBlock.find('.gallery-periods ul').stop(true, true);

                var curLeft = Number(curBlock.find('.gallery-periods ul').css('left').replace(/px/, ''));
                curLeft -= curBlock.find('.gallery-periods-inner').width() / 2;

                curBlock.find('.gallery-periods-prev').css({'display': 'block'});
                if (curBlock.find('.gallery-periods-inner ul').width() + curLeft <= curBlock.find('.gallery-periods-inner').width()) {
                    curLeft = curBlock.find('.gallery-periods-inner').width() - curBlock.find('.gallery-periods-inner ul').width();
                    curBlock.find('.gallery-periods-next').css({'display': 'none'});
                }

                curBlock.find('.gallery-periods ul').animate({'left': curLeft});

                e.preventDefault();
            });

            curBlock.find('.gallery-periods-prev a').click(function(e) {
                var curBlock = $(this).parents().filter('.gallery');

                curBlock.find('.gallery-periods ul').stop(true, true);

                var curLeft = Number(curBlock.find('.gallery-periods ul').css('left').replace(/px/, ''));
                curLeft += curBlock.find('.gallery-periods-inner').width() / 2;

                curBlock.find('.gallery-periods-next').css({'display': 'block'});
                if (curLeft >= 0) {
                    curLeft = 0;
                    curBlock.find('.gallery-periods-prev').css({'display': 'none'});
                }

                curBlock.find('.gallery-periods ul').animate({'left': curLeft});

                e.preventDefault();
            });

        });

        $('.webcam-play').click(function(e) {
            var curLink = $(this);
            var curItem = curLink.parent();
            curLink.replaceWith('<video src="' + curLink.attr('href') + '" autoplay="autoplay" />');
            curItem.flowplayer();
            e.preventDefault();
        });

        $('.slider-content video').each(function() {
            var curVideo = $(this);
            curVideo[0].addEventListener('timeupdate', function() {
                var progress = Math.floor(curVideo[0].currentTime) / Math.floor(curVideo[0].duration);
                var curIndex = $('.slider-content video').index(curVideo);
                var curProgress = $('.slider-preview ul li').eq(curIndex).find('span');
                curProgress.css({'width': Math.floor(progress * curProgress.parent().width())});
            }, false);
        });

        $('.slider-preview ul li a').click(function(e) {
            var curLink = $(this);
            var curLi = curLink.parent();

            var curIndex = $('.slider-preview ul li').index(curLi);
            var curVideo = $('.slider-content li').eq(curIndex).find('video');

            if (curLi.hasClass('active')) {
                if (curLi.hasClass('play')) {
                    curLi.removeClass('play');
                    curVideo[0].pause();
                } else {
                    curLi.addClass('play');
                    $('.slider-content li').eq(curIndex).find('.slider-bg').hide();
                    curVideo.show();
                    curVideo[0].play();
                }
            } else {
                $('.slider-preview ul li.active').removeClass('active play');
                curLi.addClass('active play');

                $('.slider-content li.active video')[0].pause();
                $('.slider-content li.active').removeClass('active');
                $('.slider-content li').eq(curIndex).addClass('active');
                $('.slider-content li').eq(curIndex).find('.slider-bg').hide();

                curVideo.show();
                curVideo[0].play();
            }

            e.preventDefault();
        });

        $('.choose-map-rooms-item-1').hover(
            function() {
                $('.choose-map-section-number-flats-1').show();
            },

            function() {
                $('.choose-map-section-number-flats-1').hide();
            }
        );

        $('.choose-map-rooms-item-2').hover(
            function() {
                $('.choose-map-section-number-flats-2').show();
            },

            function() {
                $('.choose-map-section-number-flats-2').hide();
            }
        );

        $('.choose-map-rooms-item-3').hover(
            function() {
                $('.choose-map-section-number-flats-3').show();
            },

            function() {
                $('.choose-map-section-number-flats-3').hide();
            }
        );

        $('.choose-form-reset input').click(function() {
            window.setTimeout(function() {
                $('.form-select select').trigger('chosen:updated');
            }, 100);
        });

        $('.choose-map').maphilight();

        $('.choose-content area').click(function(e) {
            var curArea = $(this);
            $('.choose-content area').data('maphilight', {"stroke":false, "fillColor":"f8ad14", "fillOpacity":0.5});
            curArea.data('maphilight', {"stroke":false, "fillColor":"f8ad14", "fillOpacity":0.5, "alwaysOn":true});
            $('.choose-map').maphilight();

            $('.choose-window').addClass('open');

            var curIndex = $('.choose-content area').index(curArea);
            $('.choose-window-sections li.active').removeClass('active');
            $('.choose-window-sections li').eq(curIndex).addClass('active');

            $('.choose-window-container').append('<div class="loading"><div class="loading-text">Загрузка данных</div></div>');
            $.ajax({
                type: 'POST',
                url: curArea.attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                $('.choose-window-container').find('.loading').remove();
                $('.choose-window-content').html(html);
            });

            e.preventDefault();
        });

        $('.choose-window-sections li a').click(function(e) {
            var curLi = $(this).parent();
            if (!curLi.hasClass('disabled')) {
                var curIndex = $('.choose-window-sections li').index(curLi);
                $('.choose-content area').eq(curIndex).click();
            }
            e.preventDefault();
        });

        $('.choose-window-close').click(function(e) {
            $('.choose-content area').data('maphilight', {"stroke":false, "fillColor":"f8ad14", "fillOpacity":0.5});
            $('.choose-map').maphilight();
            $('.choose-window').removeClass('open');
            e.preventDefault();
        });

    });

    function windowOpen(contentWindow) {
        var windowWidth     = $(window).width();
        var windowHeight    = $(window).height();
        var curScrollTop    = $(window).scrollTop();
        var curScrollLeft   = $(window).scrollLeft();

        var bodyWidth = $('body').width();
        $('body').css({'height': windowHeight, 'overflow': 'hidden'});
        var scrollWidth =  $('body').width() - bodyWidth;
        $('body').css({'padding-right': scrollWidth + 'px'});
        $(window).scrollTop(0);
        $(window).scrollLeft(0);
        $('body').css({'margin-top': -curScrollTop});
        $('body').data('scrollTop', curScrollTop);
        $('body').css({'margin-left': -curScrollLeft});
        $('body').data('scrollLeft', curScrollLeft);

        $('body').append('<div class="window"><div class="window-overlay"></div><div class="window-loading"></div><div class="window-container window-container-load"><div class="window-content">' + contentWindow + '<a href="#" class="window-close"></a></div></div></div>')

        if ($('.window-container img').length > 0) {
            $('.window-container img').each(function() {
                $(this).attr('src', $(this).attr('src'));
            });
            $('.window-container').data('curImg', 0);
            $('.window-container img').load(function() {
                var curImg = $('.window-container').data('curImg');
                curImg++;
                $('.window-container').data('curImg', curImg);
                if ($('.window-container img').length == curImg) {
                    $('.window-loading').remove();
                    $('.window-container').removeClass('window-container-load');
                    windowPosition();
                }
            });
        } else {
            $('.window-loading').remove();
            $('.window-container').removeClass('window-container-load');
            windowPosition();
        }

        $('.window-overlay').click(function() {
            windowClose();
        });

        $('.window-close, .window-close-bottom').click(function(e) {
            windowClose();
            e.preventDefault();
        });

        $('body').bind('keyup', keyUpBody);

        $('.window input.maskPhone').mask('+7 (999) 999-99-99');

        $('.window form').validate({
            submitHandler: function(form) {
                $(form).append('<div class="loading"><div class="loading-text">Отправка данных</div></div>');
                $.ajax({
                    type: 'POST',
                    url: $(form).attr('action'),
                    data: $(form).serialize(),
                    dataType: 'html',
                    cache: false
                }).done(function(html) {
                    $(form).find('.loading').remove();
                    $(form).append(html);
                });
            }
        });

    }

    function windowPosition() {
        var windowWidth     = $(window).width();
        var windowHeight    = $(window).height();

        if ($('.window-container').width() > windowWidth - 40) {
            $('.window-container').css({'left': 20, 'margin-left': 0});
            $('.window-overlay').width($('.window-container').width() + 40);
        } else {
            $('.window-container').css({'left': '50%', 'margin-left': -$('.window-container').width() / 2});
            $('.window-overlay').width('100%');
        }

        if ($('.window-container').height() > windowHeight - 40) {
            $('.window-overlay').height($('.window-container').height() + 40);
            $('.window-container').css({'top': 20, 'margin-top': 0});
        } else {
            $('.window-container').css({'top': '50%', 'margin-top': -$('.window-container').height() / 2});
            $('.window-overlay').height('100%');
        }
    }

    function keyUpBody(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    }

    function windowClose() {
        $('body').unbind('keyup', keyUpBody);
        $('.window').remove();
        $('body').css({'height': '100%', 'overflow': 'visible', 'padding-right': 0, 'margin': 0});
        $(window).scrollTop($('body').data('scrollTop'));
        $(window).scrollLeft($('body').data('scrollLeft'));
    }

    $(window).resize(function() {
        if ($('.window').length > 0) {
            var windowWidth     = $(window).width();
            var windowHeight    = $(window).height();
            var curScrollTop    = $(window).scrollTop();
            var curScrollLeft   = $(window).scrollLeft();

            $('body').css({'height': '100%', 'overflow': 'visible', 'padding-right': 0, 'margin': 0});
            var bodyWidth = $('body').width();
            $('body').css({'height': windowHeight, 'overflow': 'hidden'});
            var scrollWidth =  $('body').width() - bodyWidth;
            $('body').css({'padding-right': scrollWidth + 'px'});
            $(window).scrollTop(0);
            $(window).scrollLeft(0);
            $('body').data('scrollTop', 0);
            $('body').data('scrollLeft', 0);

            windowPosition();
        }
    });

    $(window).bind('load resize', function() {
        $('.page-404-container').each(function() {
            $(this).css({'height': $(window).height() - 40 - $('footer').height()})
        });
    });

})(jQuery);