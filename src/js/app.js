"use strict";

$(function () {



    if (typeof Fancybox !== "undefined" && Fancybox !== null) {
        Fancybox.bind("[data-fancybox]", {
            dragToClose: false,
            closeClick: "outside",
        });
    }

    /* =========== Event Handlers ============== */

    $(document).on("click", function (e) {
        const $target = $(e.target);

        // faq 
        if ($target.closest('.faq__item').length) {
            const $faqItem = $target.closest('.faq__item')
            $faqItem.toggleClass('active');
            $faqItem.find('.faq__item-answer').slideToggle()
        }

        // add to cart btn
        if ($target.is('.product__add-to-cart')) {
            $target.toggleClass('in-cart');

            if ($target.hasClass('in-cart')) {
                $target.find('span').text('В корзине')
            } else {
                $target.find('span').text('В корзину')
            }
        }

        // toggler visibility paswor
        if ($target.is('.form__password-visibility-btn')) {
            const $btn = $target;
            const $input = $btn.siblings('input[type="password"], input[type="text"]');

            if ($input.attr('type') === 'password') {
                $input.attr('type', 'text');
                $btn.removeClass('icon-eye-off').addClass('icon-eye');
            } else {
                $input.attr('type', 'password');
                $btn.removeClass('icon-eye').addClass('icon-eye-off');
            }
        }

        // toggler catalog
        if ($target.closest(".header__services-btn").length) {
            $(".header__services-btn").toggleClass('active');
            $('.header__services-content').toggleClass('visible');
            $('body').toggleClass('lock-services');
        } else if (!$target.closest(".header__services-content").length || $target.is('.header__services-close')) {
            $(".header__services-btn").removeClass('active');
            $('.header__services-content').removeClass('visible');
            $('body').removeClass('lock-services');
        }

        // menu toggler
        if ($target.closest('.header__menu-toggler').length) {
            $('.header__menu-toggler').toggleClass('active');
            $('.menu').toggleClass("menu-open");
            $('body').toggleClass('lock-menu');
        } else if (!$target.closest('.menu__body').length) {
            $('.header__menu-toggler').removeClass('active');
            $('.menu').removeClass("menu-open");
            $('body').removeClass('lock-menu');
        }

        // product info tabs
        if ($target.closest('.product-card__tab').length) {
            const $tab = $target.closest('.product-card__tab');
            const $tabsWrapper = $tab.closest('.swiper-wrapper');
            const tabIndex = $tabsWrapper.find('.product-card__tab').index($tab);
            const $infoBlock = $tab.closest('.product-card__info').find('.product-card__info-content').children().eq(tabIndex);

            $tabsWrapper.find('.product-card__tab').removeClass('active');
            $tab.addClass('active');

            $tab.closest('.product-card__info').find('.product-card__info-block').removeClass('active');
            $infoBlock.addClass('active');
        }

        // calc tabs
        if ($target.is('.calc__tab')) {
            const $tab = $target;
            const $tabsContainer = $tab.closest('.calc__tabs');
            const tabIndex = $tabsContainer.find('.calc__tab').index($tab);
            const $contentBlocks = $tab.closest('.calc__container').find('.calc__content').find('.calc__block');
            const $targetBlock = $contentBlocks.eq(tabIndex);
            const serviceName = $tab.text().trim();

            $tabsContainer.find('.calc__tab').removeClass('active');
            $tab.addClass('active');

            $contentBlocks.removeClass('active');
            $targetBlock.addClass('active');

            $tab.closest('.calc__container').find('.calc__result-service').text(serviceName.toLowerCase());
        }

        // person accordion
        if ($target.is('.person__accordion-title')) {
            const $accordion = $target.closest('.person__accordion')
            $accordion.toggleClass('active');
            $accordion.find('.person__accordion-content').slideToggle()
        }

    });


    // Display block in person accordion if title is active
    $('.person__accordion.active').each(function () {
        const $content = $(this).find('.person__accordion-content');
        $content.slideDown(0);
    });


    // form submit validation

    function initFormValidation($form) {
        $form.on('submit', function (e) {
            let isValid = true;
            $form.find('[data-required]').each(function () {
                const $input = $(this);
                const inputType = $input.attr('type');
                const inputName = $input.attr('name');

                $input.removeClass('_error');
                if ($input.closest('.select').length) {
                    $input.closest('.select').removeClass('_error');
                } else {
                    $input.parent().removeClass('_error');
                }


                const inputValue = $input.val() || '';

                if ($input.is('select') && inputValue === '') {
                    $input.addClass('_error');
                    if ($input.closest('.select').length) {
                        $input.closest('.select').addClass('_error');
                    }
                    isValid = false;
                } else if (inputType === 'checkbox' && !$input.is(':checked')) {
                    $input.addClass('_error');
                    isValid = false;
                } else if (inputName === 'phone' && !phoneTest(inputValue)) {
                    $input.addClass('_error');
                    isValid = false;
                } else if (inputName === 'email' && !emailTest(inputValue)) {
                    $input.addClass('_error');
                    isValid = false;

                } else if (inputValue.trim() === '') {
                    $input.addClass('_error');
                    isValid = false;
                }
            });

            if (!isValid) {
                e.preventDefault();
            }
        });

        $form.find('[data-required]').on('input change', function () {
            const $input = $(this);
            const inputType = $input.attr('type');
            const inputName = $input.attr('name');


            const inputValue = $input.val() || '';

            if ($input.is('select')) {
                if (inputValue !== '') {
                    $input.removeClass('_error');
                    $input.closest('.select').removeClass('_error');
                }
            } else if (inputType === 'checkbox') {
                if ($input.is(':checked')) {
                    $input.removeClass('_error');
                }
            } else if (inputName === 'phone') {
                if (phoneTest(inputValue)) {
                    $input.removeClass('_error');
                }
            } else if (inputName === 'email') {
                if (emailTest(inputValue)) {
                    $input.removeClass('_error');
                }
            } else {

                if (inputValue.trim() !== '') {
                    $input.removeClass('_error');
                }
            }
        });
    }

    // Form Validation
    $('form').each(function () {
        initFormValidation($(this));
    });

    function emailTest(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function phoneTest(phone) {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length >= 10 && /^[1-9]\d{9,14}$/.test(cleaned);
    }

    // quantity block
    $('.quantity-block').each(function () {
        const $block = $(this);
        const $input = $block.find('.quantity-block__input');
        const $btnUp = $block.find('.quantity-block__up');
        const $btnDown = $block.find('.quantity-block__down');

        $btnUp.on('click', function () {
            let currentVal = parseInt($input.val()) || 0;
            if (currentVal < 999) {
                $input.val(currentVal + 1);
            }
        });

        $btnDown.on('click', function () {
            let currentVal = parseInt($input.val()) || 0;
            if (currentVal > 1) {
                $input.val(currentVal - 1);
            }
        });

        $input.on('input', function () {
            let val = $input.val().replace(/\D/g, '');
            val = parseInt(val) || 1;
            if (val < 1) val = 1;
            if (val > 999) val = 999;
            $input.val(val);
        });


        $input.on('paste', function (e) {
            const pastedData = e.originalEvent.clipboardData.getData('text');
            if (/\D/.test(pastedData)) {
                e.preventDefault();
            }
        });
    });

    /* =========== Event Handlers ============== */




    // sliders


    if ($('.promo__banner').length) {
        new Swiper('.promo__banner', {
            slidesPerView: 1,
            effect: "fade",
            fadeEffect: {
                crossFade: true
            },
            navigation: {
                prevEl: '.promo__prev',
                nextEl: '.promo__next'
            },
            pagination: {
                el: ".promo__pagination",
                clickable: true
            }
        });
    }

    if ($('.products__slider').length) {
        new Swiper('.products__slider', {
            slidesPerView: "auto",
            spaceBetween: 10,
            navigation: {
                prevEl: '.products__prev',
                nextEl: '.products__next'
            },
            breakpoints: {
                767.98: {
                    spaceBetween: 20,
                }
            }
        });
    }

    if ($('.blog__slider').length) {
        new Swiper('.blog__slider', {
            slidesPerView: "auto",
            spaceBetween: 10,
            navigation: {
                prevEl: '.blog__prev',
                nextEl: '.blog__next'
            },
            breakpoints: {
                575.98: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                991.98: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                },
                1199.98: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                }
            }
        });
    }

    if ($('.nav-slider').length) {

        $('.nav-slider').each(function () {
            const $currentSlider = $(this);
            const $activeItem = $currentSlider.find('.nav-slider__item .label.active');

            let initialIndex = 0;

            if ($activeItem.length) {
                initialIndex = $activeItem.parent().index();
            }

            new Swiper($currentSlider[0], {
                slidesPerView: "auto",
                spaceBetween: 5,
                initialSlide: initialIndex,
                breakpoints: {
                    991.98: {
                        spaceBetween: 10,
                    }
                }
            });
        });
    }

    if ($('.clients__slider').length) {
        new Swiper('.clients__slider', {
            slidesPerView: 1,
            spaceBetween: 10,
            pagination: {
                el: '.clients__pagination',
                clickable: true
            }
        });
    }

    if ($('.services__content').length) {
        $('.services__content').each(function () {

            const currentSlider = $(this).find('.services__slider');
            const isSmallSlider = currentSlider.hasClass('services__slider--small');

            const prevButton = $(this).find('.services__prev');
            const nextButton = $(this).find('.services__next');

            new Swiper(currentSlider[0], {
                slidesPerView: "auto",
                spaceBetween: 10,

                navigation: {
                    prevEl: prevButton[0],
                    nextEl: nextButton[0]
                },

                breakpoints: {
                    767.98: {
                        slidesPerView: isSmallSlider ? 4 : 2,
                        spaceBetween: 20,
                    },
                    1399.98: {
                        slidesPerView: isSmallSlider ? 6 : 3,
                        spaceBetween: 20,
                    }
                }
            });
        });
    }


    // Phone Russia Mask

    var phoneInputs = document.querySelectorAll('input[type="tel"]');
    var getInputNumbersValue = function (input) {
        return input.value.replace(/\D/g, '');
    };
    var onPhonePaste = function (e) {
        var input = e.target,
            inputNumbersValue = getInputNumbersValue(input);
        var pasted = e.clipboardData || window.clipboardData;
        if (pasted) {
            var pastedText = pasted.getData('Text');
            if (/\D/g.test(pastedText)) {
                input.value = inputNumbersValue;
                return;
            }
        }
    };
    var onPhoneInput = function (e) {
        var input = e.target,
            inputNumbersValue = getInputNumbersValue(input),
            selectionStart = input.selectionStart,
            formattedInputValue = "";
        if (!inputNumbersValue) {
            return input.value = "";
        }
        if (input.value.length != selectionStart) {
            if (e.data && /\D/g.test(e.data)) {
                input.value = inputNumbersValue;
            }
            return;
        }
        if (inputNumbersValue.length > 11) {
            inputNumbersValue = inputNumbersValue.substring(0, 11);
        }
        formattedInputValue = "+7 (";
        if (inputNumbersValue.length >= 2) {
            formattedInputValue += inputNumbersValue.substring(1, 4);
        }
        if (inputNumbersValue.length >= 5) {
            formattedInputValue += ") " + inputNumbersValue.substring(4, 7);
        }
        if (inputNumbersValue.length >= 8) {
            formattedInputValue += "-" + inputNumbersValue.substring(7, 9);
        }
        if (inputNumbersValue.length >= 10) {
            formattedInputValue += "-" + inputNumbersValue.substring(9, 11);
        }
        input.value = formattedInputValue;
    };
    var onPhoneKeyDown = function (e) {
        var inputValue = e.target.value.replace(/\D/g, '');
        if (e.keyCode == 8 && inputValue.length == 1) {
            e.target.value = "";
        }
    };
    for (var phoneInput of phoneInputs) {
        phoneInput.addEventListener('focus', function () {
            if (!this.value) {
                this.value = "+7 ";
            }
        });
        phoneInput.addEventListener('keydown', onPhoneKeyDown);
        phoneInput.addEventListener('input', onPhoneInput, false);
        phoneInput.addEventListener('paste', onPhonePaste, false);
    }


    // custom select
    class CustomSelect {
        static openDropdown = null;
        constructor(selectElement) {
            this.$select = $(selectElement);
            this.placeholder = this.$select.data('placeholder');
            this.listCaption = this.$select.data('list-caption');
            this.defaultText = this.getDefaultText();
            this.selectName = this.$select.attr('name');
            this.$options = this.$select.find('option');
            this.$dropdown = null;
            this.initialState = {};
            this.init();
        }
        init() {
            if (!this.$select.length) return;
            this.saveInitialState();
            this.$select.addClass('hidden');
            this.renderDropdown();
            this.setupEvents();
        }
        saveInitialState() {
            const selectedOption = this.$select.find('option:selected');
            this.initialState = {
                selectedText: selectedOption.text(),
                selectedValue: selectedOption.val(),
            };
        }
        getDefaultText() {
            const selectedOption = this.$select.find('option[selected]');
            if (selectedOption.length) {
                return selectedOption.text();
            } else {
                return this.placeholder || this.$select.find('option:selected').text();
            }
        }
        renderDropdown() {
            const isDisabled = this.$select.is(':disabled');
            const buttonTemplate = `
        <button type="button" class="dropdown__button icon-chevron-down" 
            aria-expanded="false" 
            aria-haspopup="true" 
            ${isDisabled ? 'disabled' : ''}>
            <span class="dropdown__button-text">${this.defaultText}</span>
        </button>
    `;
            this.$dropdown = $('<div>').addClass('dropdown');
            const captionTemplate = this.listCaption ? `<div class="dropdown__caption">${this.listCaption}</div>` : '';
            this.$dropdown.html(`
        ${buttonTemplate}
        <div class="dropdown__body" aria-hidden="true">
           <div class="dropdown__content">
               ${captionTemplate}
               <ul class="dropdown__list" role="listbox"></ul>
           </div>
        </div>
    `);
            const list = this.$dropdown.find('.dropdown__list');
            this.$options.each((index, option) => {
                const $option = $(option);
                const value = $option.val();
                const text = $option.text();
                const isSelected = $option.is(':selected');
                const isDisabled = $option.is(':disabled');
                const listItem = $('<li>')
                    .attr('role', 'option')
                    .data('value', value)
                    .attr('aria-checked', isSelected)
                    .addClass('dropdown__list-item')
                    .text(text);
                if (isSelected) listItem.addClass('selected');
                if (isDisabled) {
                    listItem.addClass('disabled');
                    listItem.attr('aria-disabled', 'true');
                }
                list.append(listItem);
            });
            this.$select.before(this.$dropdown);
        }
        setupEvents() {
            const button = this.$dropdown.find('.dropdown__button');
            button.on('click', (event) => {
                event.stopPropagation();
                const isOpen = this.$dropdown.hasClass('visible');
                this.toggleDropdown(!isOpen);
            });
            this.$dropdown.on('click', '.dropdown__list-item', (event) => {
                event.stopPropagation();
                const item = $(event.currentTarget);
                if (!item.hasClass('disabled')) {
                    this.selectOption(item);
                }
            });
            $(document).on('click', () => this.closeDropdown());
            $(document).on('keydown', (event) => {
                if (event.key === 'Escape') this.closeDropdown();
            });
            this.$select.closest('form').on('reset', () => this.restoreInitialState());
        }
        toggleDropdown(isOpen) {
            if (isOpen && CustomSelect.openDropdown && CustomSelect.openDropdown !== this) {
                CustomSelect.openDropdown.closeDropdown();
            }
            const body = this.$dropdown.find('.dropdown__body');
            const list = this.$dropdown.find('.dropdown__list');
            const hasScroll = list[0].scrollHeight > list[0].clientHeight;
            this.$dropdown.toggleClass('visible', isOpen);
            this.$dropdown.find('.dropdown__button').attr('aria-expanded', isOpen);
            body.attr('aria-hidden', !isOpen);
            if (isOpen) {
                CustomSelect.openDropdown = this;
                this.$dropdown.removeClass('dropdown-top');
                const dropdownRect = body[0].getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                if (dropdownRect.bottom > viewportHeight) {
                    this.$dropdown.addClass('dropdown-top');
                }
                list.toggleClass('has-scroll', hasScroll);
            } else {
                if (CustomSelect.openDropdown === this) {
                    CustomSelect.openDropdown = null;
                }
            }
        }
        closeDropdown() {
            this.toggleDropdown(false);
        }
        selectOption(item) {
            const value = item.data('value');
            const text = item.text();
            this.$dropdown.find('.dropdown__list-item').removeClass('selected').attr('aria-checked', 'false');
            item.addClass('selected').attr('aria-checked', 'true');
            this.$dropdown.find('.dropdown__button').addClass('selected');
            this.$dropdown.find('.dropdown__button-text').text(text);
            this.$select.val(value).trigger('change');
            this.closeDropdown();
        }
        restoreInitialState() {
            const hasPlaceholder = this.placeholder !== undefined;
            if (hasPlaceholder) {
                this.$select.prop('selectedIndex', -1).trigger('change');
                this.$dropdown.find('.dropdown__button-text').text(this.placeholder);
                this.$dropdown.find('.dropdown__button').removeClass('selected');
                this.$dropdown.find('.dropdown__list-item').removeClass('selected').attr('aria-checked', 'false');
            } else {
                const state = this.initialState;
                this.$select.val(state.selectedValue).trigger('change');
                this.$dropdown.find('.dropdown__list-item').removeClass('selected').attr('aria-checked', 'false');
                const selectedItem = this.$dropdown.find(`.dropdown__list-item[data-value="${state.selectedValue}"]`);
                if (selectedItem.length) {
                    selectedItem.addClass('selected').attr('aria-checked', 'true');
                }
                this.$dropdown.find('.dropdown__button-text').text(state.selectedText);
                this.$dropdown.find('.dropdown__button').addClass('selected');
            }
        }
        syncSelectedOption() {
            const selectedOption = this.$select.find('option:selected');
            const selectedValue = selectedOption.val();
            const selectedText = selectedOption.text();
            this.$dropdown.find('.dropdown__list-item').removeClass('selected').attr('aria-checked', 'false');
            const selectedItem = this.$dropdown.find(`.dropdown__list-item[data-value="${selectedValue}"]`);
            selectedItem.addClass('selected').attr('aria-checked', 'true');
            this.$dropdown.find('.dropdown__button-text').text(selectedText);
        }
    }
    $('.select').each((index, element) => {
        const $element = $(element);
        const $select = $element.find('select');
        if ($select.length) {
            new CustomSelect($select[0]);
        }
    });


    // range slider

    const rangeFilters = $('.range');

    if (rangeFilters.length > 0) {
        rangeFilters.each(function () {
            const rangeSlider = $(this).find('.range__slider')[0];
            const startInput = $(this).find('.range__control--start');
            const endInput = $(this).find('.range__control--end');
            const inputs = [startInput, endInput];
            const form = $(this).closest('form');
            const resetButton = form.find('button[type="reset"]');
            const externalResetButton = $(`button[type="reset"][form="${form.attr('id')}"]`);
            const allResetButtons = $.merge(resetButton, externalResetButton);
            const min = parseInt(startInput.attr('min'));
            const max = parseInt(endInput.attr('max')) || 1000000;
            const margin = Math.round((max - min) * 0.05);



            function parseNumber(value) {
                return parseInt(value.replace(/\s/g, ''));
            }

            function updateMaxLength(input) {
                const maxLength = parseInt(input.attr('maxlength'));
                const numLength = maxLength - Math.floor((maxLength - 1) / 4);
                input.attr('maxlength', numLength);
            }

            function getTextWidth(text, input) {
                const span = document.createElement("span");
                const cs = window.getComputedStyle(input);
                span.style.position = "absolute";
                span.style.visibility = "hidden";
                span.style.whiteSpace = "nowrap";
                span.style.font = cs.font;
                span.style.letterSpacing = cs.letterSpacing;
                span.textContent = String(text || "");
                document.body.appendChild(span);
                const w = span.offsetWidth;
                document.body.removeChild(span);
                return w;
            }

            function updateUnitPosition(input) {
                const $input = $(input);
                const $units = $input.siblings(".range__unit");
                if ($units.length === 0) return;

                const cs = window.getComputedStyle(input);
                const value = $input.val();
                const textWidth = getTextWidth(value, input);

                const paddingLeft = parseFloat(cs.paddingLeft) || 0;
                const paddingRight = parseFloat(cs.paddingRight) || 0;
                const clientWidth = input.clientWidth;
                const gap = 4;

                const textStartX = paddingLeft;

                const $currency = $units.last();
                const currencyWidth = $currency.outerWidth();
                const desiredCurrencyLeft = textStartX + textWidth + gap;
                const maxCurrencyLeft = clientWidth - paddingRight - currencyWidth;
                const currencyLeft = Math.min(desiredCurrencyLeft, maxCurrencyLeft);
                $currency.css("left", currencyLeft + "px");

                const $label = $units.first();
                const labelWidth = $label.outerWidth();

                const labelLeft = Math.max(0, paddingLeft - labelWidth - gap);
                $label.css("left", labelLeft + "px");

                $units.addClass("ready");
            }



            updateMaxLength(startInput);
            updateMaxLength(endInput);

            startInput.val(startInput.val());
            endInput.val(endInput.val());


            noUiSlider.create(rangeSlider, {
                start: [parseNumber(startInput.val()), parseNumber(endInput.val())],
                connect: true,
                margin: margin,
                range: {
                    'min': [min],
                    'max': [max]
                }
            });

            rangeSlider.noUiSlider.on('update', function (values, handle) {
                inputs[handle].val(Math.round(values[handle]));
                updateUnitPosition(inputs[handle][0]);
            });


            const setRangeSlider = (i, value) => {
                let arr = [null, null];
                arr[i] = parseNumber(value);
                rangeSlider.noUiSlider.set(arr);
            };

            $.each(inputs, function (index, input) {
                $(input).on('change', function (e) {
                    setRangeSlider(index, $(this).val());
                });
                $(input).on('input', function (e) {
                    let value = $(this).val();
                    value = value.replace(/[^\d]/g, '');
                    $(this).val(value);
                    $(this).addClass('active');
                });
                $(input).on('input change', function () {
                    updateUnitPosition(this);
                });
                updateUnitPosition(input[0]);
            });
            const ro = new ResizeObserver(() => {
                updateUnitPosition(startInput[0]);
                updateUnitPosition(endInput[0]);
            });
            ro.observe(startInput[0]);
            ro.observe(endInput[0]);
            if (allResetButtons.length > 0) {
                allResetButtons.on('click', function () {
                    setTimeout(function () {
                        startInput.val(startInput[0].defaultValue);
                        endInput.val(endInput[0].defaultValue);
                        rangeSlider.noUiSlider.set([parseNumber(startInput[0].defaultValue), parseNumber(endInput[0].defaultValue)]);
                    }, 0);
                });
            }
        });
    }

    var arrowTop = $('.arrow-top');

    if (arrowTop.length) {

        $(window).on('scroll', function () {
            var scrollPosition = $(window).scrollTop();
            var viewportHeight = $(window).height();

            if (scrollPosition > viewportHeight) {
                arrowTop.addClass('visible');
            } else {
                arrowTop.removeClass('visible');
            }
        });
    }


    // cart details payment
    function showPaymentBlock(value) {

        $('.cart__payment-block').hide();
        const targetId = `#payment_${value}`;

        $(targetId).show();
    }
    $('input[name="payment"]').on('change', function () {
        const selectedValue = $(this).val();
        showPaymentBlock(selectedValue);
    });

    const defaultChecked = $('input[name="payment"]:checked');
    if (defaultChecked.length) {
        showPaymentBlock(defaultChecked.val());
    }


});


