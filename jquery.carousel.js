/**
 * User: Oliver Turner - oliver.turner@codedsignal.co.uk
 * Date: 04/09/2013
 * Time: 11:18
 */

(function ($) {
  /**
   * Constructor
   * @param [options]
   */
  $.fn.carousel = function (options) {
    var defaults = {
      btnPrev    : '[data-click=carousel-prev]',
      btnNext    : '[data-click=carousel-next]',
      slide      : '[data-role=carousel-slide]',
      controls   : '[data-role=carousel-controls]',
      controlItem: '[data-role=carousel-control]',
      current    : 0
    };

    options = $.extend({}, defaults, options);

    var $controls, $btnPrev, $btnNext, $slideWrap;
    var controlItems, slides;
    var current, min, max, dx;

    slides = this.find(options.slide);
    controlItems = this.find(options.controlItem);

    $slideWrap = $(slides[0]).parent();
    $btnPrev = this.find(options.btnPrev).first();
    $btnNext = this.find(options.btnNext).first();
    $controls = this.find(options.controls).first();

    min = 0;
    max = slides.length - 1;
    dx = this.outerWidth();

    $btnPrev.on('click', _onNavClick);
    $btnNext.on('click', _onNavClick);
    $controls.on('click', options.controlItem, _onControlClick);

    // Initialise
    $slideWrap.css({width: dx * slides.length});
    setCurrent(options.current);

    // Methods
    //-----------------------------------------------
    function _onControlClick(event) {
      event.preventDefault();

      setCurrent(controlItems.index(this));
    }

    /**
     * Handle click events from Prev / Next buttons
     * @param {object} event
     * @private
     */
    function _onNavClick(event) {
      event.preventDefault();

      var dir, cur;
      dir = $(this).data('click') === 'carousel-next' ? 1 : -1;
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
      if (current < min) current = min;
      if (current >= max) current = max;

      current === min ? $btnPrev.addClass('inactive') : $btnPrev.removeClass('inactive');
      current === max ? $btnNext.addClass('inactive') : $btnNext.removeClass('inactive');

      if (controlItems.length) {
        activeControl = controlItems.removeClass('active').get(current);
        $(activeControl).addClass('active');
      }

      $slideWrap.animate({left: current * dx * -1});
    }
  };

})(jQuery);