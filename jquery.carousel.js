/**
 * User: Oliver Turner - oliver.turner@codedsignal.co.uk
 * Date: 04/09/2013
 * Time: 11:18
 */

(function ($) {

  'use strict';

  /**
   * Constructor
   * @param [options]
   */
  $.fn.carousel = function (options) {
    var defaults = {
      btnPrev    : '[data-click=carousel-prev]',
      btnNext    : '[data-click=carousel-next]',
      mask       : '[data-role=carousel-mask]',
      content    : '[data-role=carousel-content]',
      slide      : '[data-role=carousel-slide]',
      controls   : '[data-role=carousel-controls]',
      controlItem: '[data-role=carousel-control]',
      current    : 0
    };

    options = $.extend({}, defaults, options);

    var $controls, $btnPrev, $btnNext, $mask, $content;
    var controlItems, slides;
    var current, min, max, dx, cx;

    current = options.current;
    controlItems = this.find(options.controlItem);

    $mask = this.find(options.mask).first();
    $content = this.find(options.content).first();
    $btnPrev = this.find(options.btnPrev).first();
    $btnNext = this.find(options.btnNext).first();
    $controls = this.find(options.controls).first();

    cx = 0;
    slides = this.find(options.slide);
    slides.each(function(index, el){
      cx += $(el).outerWidth();
    });

    $content.css({width: cx});

    dx = $mask.outerWidth();
    min = 0;
    max = Math.ceil(cx / dx) - 1;

    // Check to see whether a slide is defined as active in mark-up
    if (current === defaults.current) {
      var $active, $slide;
      var perFrame, index;

      $active = $content.find(options.slide + '.active');

      if (!$active.length) {
        return;
      }

      $slide   = slides.first();
      perFrame = Math.floor(dx / $slide.outerWidth());
      index    = slides.index($active);
      current  = Math.floor((index + 1) / perFrame);
    }

    // Methods
    //-----------------------------------------------
    function _onControlClick(event) {
      event.preventDefault();

      setCurrent(controlItems.index(event.currentTarget));
    }

    /**
     * Handle click events from Prev / Next buttons
     * @param {object} event
     * @private
     */
    function _onNavClick(event) {
      event.preventDefault();

      var dir, cur;
      dir = $(event.currentTarget).data('click') === 'carousel-next' ? 1 : -1;
      cur = current + dir;

      setCurrent(cur);
    }

    /**
     * Animate to current slide
     * Set the visual state of nav btns
     * @param {number} cur
     */
    function setCurrent(cur) {
      var activeControl;

      current = cur;
      if (current < min)  { current = min; }
      if (current >= max) { current = max; }

      current === min ? $btnPrev.addClass('inactive') : $btnPrev.removeClass('inactive');
      current === max ? $btnNext.addClass('inactive') : $btnNext.removeClass('inactive');

      if (controlItems.length) {
        activeControl = controlItems.removeClass('active').get(current);
        $(activeControl).addClass('active');
      }

      $content.animate({left: current * dx * -1}, 'slow');
    }

    // Initialise
    // Add event handlers
    $btnPrev.on('click', _onNavClick);
    $btnNext.on('click', _onNavClick);
    $controls.on('click', options.controlItem, _onControlClick);

    // Display correct "frame" on window.load
    $(window).one('load', function () {
      setCurrent(current);
    });
  };

})(jQuery);
