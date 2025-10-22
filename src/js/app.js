"use strict";

$(function () {

    // preloader
    // if ($('.preloader').length > 0) {
    //     let counting = setInterval(function () {
    //         let loader = $('#percentage');
    //         let currval = parseInt(loader.text());

    //         if (currval < 90) {
    //             loader.text(++currval);
    //         } else if (currval < 95 && document.readyState === "interactive") {
    //             loader.text(95);
    //         } else if (currval < 99 && document.readyState === "complete") {
    //             loader.text(99);
    //         }

    //         if (currval >= 99 && document.readyState === "complete") {
    //             clearInterval(counting);
    //             loader.text(100);
    //             setTimeout(function () {
    //                 $('body').removeClass('preloading').addClass('is-loaded');
    //             }, 300);
    //         }
    //     }, 20);
    // }

    if (typeof Fancybox !== "undefined" && Fancybox !== null) {
        Fancybox.bind("[data-fancybox]", {
            dragToClose: false,
            closeButton: false,
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

    });


    $(document).on("keydown", function (e) {
        if (e.key === "Escape" && $(".catalog").hasClass("catalog--open")) {
            $(".catalog").removeClass("catalog--open");
            $("body").removeClass("catalog-lock");
        }
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

                // Получаем значение, заменяя null или undefined пустой строкой
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
                    // Используем inputValue.trim() вместо $input.val().trim()
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

            // Также обновляем здесь
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
                // Используем inputValue.trim()
                if (inputValue.trim() !== '') {
                    $input.removeClass('_error');
                }
            }
        });
    }

    // Запуск для всех форм
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


    // Display filter block in Сatalog if title is active
    $('.filter__block-title.active').each(function () {
        const $title = $(this);
        const $content = $title.next('.filter__block-content');
        $content.slideDown(0);
    });


    // "grid" или "rows" в Каталоге

    $('.shop__grid-input').on('change', function () {
        const gridType = $(this).val();
        const $shopItems = $('.shop__items');

        if (gridType === 'rows') {
            $shopItems.addClass('shop__items--row');
        } else {
            $shopItems.removeClass('shop__items--row');
        }
    });


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
            spaceBetween: 20,
            navigation: {
                prevEl: '.products__prev',
                nextEl: '.products__next'
            }
        });
    }

    if ($('.blog__slider').length) {
        new Swiper('.blog__slider', {
            slidesPerView: 4,
            spaceBetween: 20,
            navigation: {
                prevEl: '.blog__prev',
                nextEl: '.blog__next'
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
                spaceBetween: 10,
                initialSlide: initialIndex
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


    // Function for handling dynamic adaptation
    // class DynamicAdapt {
    //     constructor(type) {
    //         this.type = type;
    //         this.оbjects = [];
    //         this.daClassname = "_dynamic_adapt_";
    //         this.nodes = $('[data-da]');
    //     }

    //     init() {
    //         // Populate the objects array
    //         this.nodes.each((i, node) => {
    //             const $node = $(node);
    //             const data = $node.data('da').trim();
    //             const dataArray = data.split(",");
    //             const оbject = {};
    //             оbject.element = $node;
    //             оbject.parent = $node.parent();
    //             оbject.destination = $(dataArray[0].trim());
    //             оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
    //             оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
    //             оbject.index = this.indexInParent(оbject.parent, оbject.element);
    //             this.оbjects.push(оbject);
    //         });

    //         this.arraySort(this.оbjects);

    //         // Array of unique media queries
    //         this.mediaQueries = this.оbjects.map(item => {
    //             return `(${this.type}-width: ${item.breakpoint}px),${item.breakpoint}`;
    //         }).filter((item, index, self) => {
    //             return self.indexOf(item) === index;
    //         });

    //         // Attach listener to media query and call handler on first load
    //         this.mediaQueries.forEach(media => {
    //             const mediaSplit = media.split(',');
    //             const matchMedia = window.matchMedia(mediaSplit[0]);
    //             const mediaBreakpoint = mediaSplit[1];

    //             // Array of objects with matching breakpoint
    //             const objectsFilter = this.оbjects.filter(item => {
    //                 return item.breakpoint === mediaBreakpoint;
    //             });

    //             matchMedia.addListener(() => {
    //                 this.mediaHandler(matchMedia, objectsFilter);
    //             });
    //             this.mediaHandler(matchMedia, objectsFilter);
    //         });
    //     }

    //     mediaHandler(matchMedia, оbjects) {
    //         if (matchMedia.matches) {
    //             оbjects.forEach(оbject => {
    //                 оbject.index = this.indexInParent(оbject.parent, оbject.element);
    //                 this.moveTo(оbject.place, оbject.element, оbject.destination);
    //             });
    //         } else {
    //             оbjects.forEach(оbject => {
    //                 if (оbject.element.hasClass(this.daClassname)) {
    //                     this.moveBack(оbject.parent, оbject.element, оbject.index);
    //                 }
    //             });
    //         }
    //     }

    //     // Move function
    //     moveTo(place, element, destination) {
    //         element.addClass(this.daClassname);
    //         if (place === 'last' || place >= destination.children().length) {
    //             destination.append(element);
    //         } else if (place === 'first') {
    //             destination.prepend(element);
    //         } else {
    //             destination.children().eq(place).before(element);
    //         }
    //     }

    //     // Return function
    //     moveBack(parent, element, index) {
    //         element.removeClass(this.daClassname);
    //         if (parent.children().eq(index).length) {
    //             parent.children().eq(index).before(element);
    //         } else {
    //             parent.append(element);
    //         }
    //     }

    //     // Get index within parent
    //     indexInParent(parent, element) {
    //         const parentChildren = parent.children();
    //         return parentChildren.index(element);
    //     }

    //     // Sort array by breakpoint and place
    //     arraySort(arr) {
    //         if (this.type === "min") {
    //             arr.sort((a, b) => a.breakpoint - b.breakpoint || a.place - b.place);
    //         } else {
    //             arr.sort((a, b) => b.breakpoint - a.breakpoint || b.place - a.place);
    //         }
    //     }
    // }

    // const da = new DynamicAdapt("max");
    // da.init();


    // Contacts Block Map



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
                const contentWidth = Math.max(0, clientWidth - paddingLeft - paddingRight);
                let textStartX;
                const ta = cs.textAlign;
                if (ta === "center") {
                    textStartX = paddingLeft + Math.max(0, (contentWidth - textWidth) / 2);
                } else if (ta === "right" || ta === "end") {
                    textStartX = clientWidth - paddingRight - textWidth;
                } else {
                    textStartX = paddingLeft;
                }
                const gap = 4;
                const $currency = $units.last();
                const currencyWidth = $currency.outerWidth();
                const desiredCurrencyLeft = textStartX + textWidth + gap;
                const maxCurrencyLeft = clientWidth - paddingRight - currencyWidth;
                const currencyLeft = Math.min(desiredCurrencyLeft, maxCurrencyLeft);
                $currency.css("left", currencyLeft + "px");
                const $label = $units.first();
                const labelWidth = $label.outerWidth();
                let desiredLabelLeft = textStartX - labelWidth - gap;
                const minLabelLeft = paddingLeft;
                let labelLeft = Math.max(minLabelLeft, desiredLabelLeft);
                const labelRight = labelLeft + labelWidth;
                if (labelRight + gap > currencyLeft) {
                    labelLeft = Math.max(minLabelLeft, currencyLeft - labelWidth - gap);
                }
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

    // order form validation

    // function validateStep($step) {
    //     let isValid = true;

    //     $step.find("[data-required]").each(function () {
    //         const $field = $(this);
    //         const value = $field.val().trim();

    //         if (!value) {
    //             isValid = false;
    //             return;
    //         }

    //         if ($field.attr("type") === "email") {
    //             const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //             if (!emailPattern.test(value)) {
    //                 isValid = false;
    //             }
    //         }

    //         if ($field.attr("type") === "tel") {
    //             const phonePattern = /^[0-9\-\+\(\)\s]{5,20}$/;
    //             if (!phonePattern.test(value)) {
    //                 isValid = false;
    //             }
    //         }
    //     });

    //     const $radioGroups = $step.find("input[type=radio]").map(function () {
    //         return $(this).attr("name");
    //     }).get();

    //     const uniqueGroups = [...new Set($radioGroups)];

    //     uniqueGroups.forEach(function (name) {
    //         if ($step.find(`input[name="${name}"]`).length) {
    //             if (!$step.find(`input[name="${name}"]:checked`).length) {
    //                 isValid = false;
    //             }
    //         }
    //     });

    //     return isValid;
    // }

    // function checkSteps() {
    //     let allValid = true;

    //     $(".order__step").each(function (index) {
    //         const $step = $(this);
    //         const $next = $(".order__step").eq(index + 1);

    //         if (validateStep($step)) {
    //             $step.addClass("order__step--done");
    //             if ($next.length) {
    //                 $next.removeClass("hidden");
    //             }
    //         } else {
    //             $step.removeClass("order__step--done");
    //             if ($next.length) {
    //                 $next.addClass("hidden");
    //             }
    //             allValid = false;
    //         }
    //     });

    //     const $btn = $(".order__form button[type=submit]");
    //     const $notifyWarning = $(".order__form-notify--warning");
    //     const $notifySuccess = $(".order__form-notify--success");

    //     if (allValid) {
    //         $btn.prop("disabled", false);
    //         $notifyWarning.addClass("hidden");
    //         $notifySuccess.removeClass("hidden");
    //     } else {
    //         $btn.prop("disabled", true);
    //         $notifyWarning.removeClass("hidden");
    //         $notifySuccess.addClass("hidden");
    //     }
    // }

    // $(document).on("input change", ".order__step input, .order__step textarea", function () {
    //     checkSteps();
    // });

    // checkSteps();
});


