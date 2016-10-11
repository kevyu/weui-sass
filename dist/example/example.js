/**
 * Created by jfengjiang on 2015/9/11.
 */

$(function () {
    // page stack
    var stack = [];
    var $container = $('.js_container');
    $container.on('click', '.js_cell[data-id]', function () {
        var id = $(this).data('id');
        go(id);
    });

    // location.hash = '#hash1' 和点击后退都会触发`hashchange`，这个demo页面只关心后退
    $(window).on('hashchange', function (e) {
        if (/#.+/gi.test(e.newURL)) {
            return;
        }
        var $top = stack.pop();
        if (!$top) {
            return;
        }
        $top.addClass('slideOut').on('animationend', function () {
            $top.remove();
        }).on('webkitAnimationEnd', function () {
            $top.remove();
        });
    });

    function go(id){
        var $tpl = $($('#tpl_' + id).html()).addClass('slideIn').addClass(id);
        $container.append($tpl);
        stack.push($tpl);
        // why not use `history.pushState`, https://github.com/weui/weui/issues/26
        //history.pushState({id: id}, '', '#' + id);
        location.hash = '#' + id;

        $($tpl).on('webkitAnimationEnd', function (){
            $(this).removeClass('slideIn');
        }).on('animationend', function (){
            $(this).removeClass('slideIn');
        });
        // tooltips
        if (id == 'cell') {
            $('.js_tooltips').show();
            setTimeout(function (){
                $('.js_tooltips').hide();
            }, 3000);
        }
    }

    if (/#.*/gi.test(location.href)) {
        go(location.hash.slice(1));
    }

    // toast
    $container.on('click', '#showToast', function () {
        $('#toast').fadeIn(200);
        setTimeout(function () {
            $('#toast').fadeOut(200);
        }, 5000);
    });
    $container.on('click', '#showLoadingToast', function () {
        $('#loadingToast').fadeIn(200);
        setTimeout(function () {
            $('#loadingToast').fadeOut(200);
        }, 5000);
    });

    $container.on('click', '#showDialog1', function () {
        $('#dialog1').fadeIn(200);
        $('#dialog1').find('.weui-dialog__btn').on('click', function () {
            $('#dialog1').fadeOut(200);
        });
    });
    $container.on('click', '#showDialog2', function () {
        $('#dialog2').fadeIn(200);
        $('#dialog2').find('.weui-dialog__btn').on('click', function () {
            $('#dialog2').fadeOut(200);
        });
    });
    $container.on('click', '#showDialog3', function () {
        $('#dialog3').fadeIn(200);
        $('#dialog3').find('.weui-dialog__btn').on('click', function () {
            $('#dialog3').fadeOut(200);
        });
    });
    $container.on('click', '#showDialog4', function () {
        $('#dialog4').fadeIn(200);
        $('#dialog4').find('.weui-dialog__btn').on('click', function () {
            $('#dialog4').fadeOut(200);
        });
    });

    $container.on('click', '.weui-navbar_item,.weui-tabbar_item', function () {
        $(this).addClass('weui-bar_item_on').siblings().removeClass('weui-bar_item_on');
    });

    $container.on('focus', '#searchInput', function () {
        var $weuiSearchBar = $('#searchBar');
        $weuiSearchBar.addClass('weui-search-bar_focusing');
    }).on('blur', '#searchInput', function () {
        var $weuiSearchBar = $('#searchBar');
        $weuiSearchBar.removeClass('weui-search-bar_focusing');
        if ($(this).val()) {
            $('#searchText').hide();
        } else {
            $('#searchText').show();
        }
    }).on('input', '#searchInput', function () {
        var $searchShow = $("#search_show");
        if ($(this).val()) {
            $searchShow.show();
        } else {
            $searchShow.hide();
        }
    }).on('touchend', '#search_cancel', function () {
        $("#search_show").hide();
        $('#searchInput').val('');
    }).on('touchend', '#search_clear', function () {
        $("#search_show").hide();
        $('#searchInput').val('');
    });

    function hideActionSheet(weuiActionsheet, mask) {
        weuiActionsheet.removeClass('weui-actionsheet_toggle');
        weuiActionsheet.on('transitionend', function () {
            mask.fadeOut(200);
        }).on('webkitTransitionEnd', function () {
            mask.fadeOut(200);
        })
    }
    $container.on('click','#showIOSActionSheet', function () {
        var mask = $('#mask');
        var weuiActionsheet = $('#iosActionsheet');
        weuiActionsheet.addClass('weui-actionsheet_toggle');
        mask.fadeIn(200).click(function () {
            hideActionSheet(weuiActionsheet, mask);
        });
        $('#actionsheet_cancel').click(function () {
            hideActionSheet(weuiActionsheet, mask);
        });
        weuiActionsheet.unbind('transitionend').unbind('webkitTransitionEnd');
    });
    $container.on('click','#showAndroidActionSheet', function(){
        var androidActionSheet = $('#androidActionsheet');
        var androidMask = $('#androidActionsheet > .weui-mask')
        androidActionSheet.fadeIn(200);
        androidMask.on('click',function () {
            androidActionSheet.fadeOut(200);
        });
    })
});