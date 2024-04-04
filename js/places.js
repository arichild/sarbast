$(document).ready(function(){
    $('input, select').styler();

    const tabs = document.querySelectorAll('.ui-tab');
    const content = document.querySelectorAll('.ui-tabcontent');

    if(tabs || content.length) {
        tabs.forEach(element => {
            element.addEventListener('click', (e) => {
                const tab = e.target
                const tabContent = tab.closest('.ui-tab').querySelector('.ui-tabcontent')

                tabs.forEach(element => {
                    if(!tab.classList.contains('active') && !tabContent.classList.contains('active')) {
                        const tab = element.querySelector('.ui-tablinks')
                        const tabContent = element.querySelector('.ui-tabcontent')

                        tab.classList.remove('active')
                        tabContent.classList.remove('active')
                    }
                });

                tab.classList.toggle('active')
                tabContent.classList.toggle('active')
            })
        });
    }

    let collection, myMap, menu, ZoomLayout, zoomControl, BalloonLayout, BalloonContentLayout, routeControl, objects, objectManager;

    let balloonSvgBg = '<svg \n' +
        ' xmlns="http://www.w3.org/2000/svg"\n' +
        ' xmlns:xlink="http://www.w3.org/1999/xlink"\n' +
        ' width="439px" height="359px">\n' +
        '<defs>\n' +
        '<filter filterUnits="userSpaceOnUse" id="Filter_0" x="0px" y="0px" width="439px" height="359px"  >\n' +
        '    <feOffset in="SourceAlpha" dx="6.018" dy="7.986" />\n' +
        '    <feGaussianBlur result="blurOut" stdDeviation="6.164" />\n' +
        '    <feFlood flood-color="rgb(61, 60, 58)" result="floodOut" />\n' +
        '    <feComposite operator="atop" in="floodOut" in2="blurOut" />\n' +
        '    <feComponentTransfer><feFuncA type="linear" slope="0.35"/></feComponentTransfer>\n' +
        '    <feMerge>\n' +
        '    <feMergeNode/>\n' +
        '    <feMergeNode in="SourceGraphic"/>\n' +
        '  </feMerge>\n' +
        '</filter>\n' +
        '\n' +
        '</defs>\n' +
        '<g filter="url(#Filter_0)">\n' +
        '<path fill-rule="evenodd"  fill="rgb(255, 255, 255)"\n' +
        ' d="M53.000,31.000 L373.000,31.000 C384.046,31.000 393.000,39.954 393.000,51.000 L393.000,311.000 C393.000,311.000 368.158,291.000 332.771,291.000 C245.185,291.000 53.000,291.000 53.000,291.000 C41.954,291.000 33.000,282.046 33.000,271.000 L33.000,51.000 C33.000,39.954 41.954,31.000 53.000,31.000 Z"/>\n' +
        '</g>\n' +
        '</svg>';

    ymaps.ready(init);

    function showRoute (x, y) {
        //routeControl.routePanel.geolocate('from');

        let location = ymaps.geolocation.get();
        location.then(function (res) {
            // Получение адреса местоположения пользователя.
            let userTextLocation = res.geoObjects.get(0).properties.get('text');
            console.log(res.geoObjects.get(0).properties)
            console.log(res)

            routeControl.routePanel.state.set({
                // В качестве начальной точки маршрута будет установлено
                // местоположение пользователя.
                from: userTextLocation,
                // Адрес конечной точки.
                to: [x, y]
            });

            $('.get_directions').remove();
            $('.ymaps-2-1-79-route-panel__clear-row')
                .append('<a href="yandexnavi://build_route_on_map?lat_to=' + x + '&lon_to=' + y + '" class="get_directions">Проложить маршрут в навигаторе</a>');
        });
        /*
        routeControl.routePanel.state.set({
            toEnabled: false,
            to: [x, y]
        });*/

    }

    // ?
    window.showRoute = showRoute;


    function createMenu (item) {
        let work_hours_from = parseInt(item.open_from);
        let work_hours_to   = parseInt(item.open_to);
        let coords = item.coords.split(',');

        let date = new Date();

        let current_hours = parseInt(date.getUTCHours() + 6);
        let status = false;

        if(current_hours >= work_hours_from && current_hours < work_hours_to)
            status = true;

        let name = item.name;
        if (name === '') {
            name = item.legal_name;
        }

        let submenuItem = $('<li data-address="' + item.address + '" data-type="' + item.type + '" data-cityID="' + item.cityID + '"><a href="#" class="link link--black">' + name + '</a></li>');
        /*
        let placemark = new ymaps.Placemark(coords, {
                balloonContentHeader: item.name,
                balloonContent: "<p>Адрес: <span>"
                    + " " + item.address + "</span></p>"
                    + "<p>Телефон: <span>"
                    + item.phone + "</span></p>"
                    + "<p>Открыто до: <span>" + item.open_to.substr(0, 5) + "</span></p>"
                    + "<p class='" + (status ? "text-open" : "text-close") + "'>" + (status ? "Сейчас открыто" : "Сейчас закрыто") + "</p>",
                balloonContentFooter: "<p class='map-route' onclick='showRoute(" + coords[0] + ", " + coords[1] + ")'>Построить маршрут</p>",
            }, {
                iconLayout: 'default#image',
                iconImageHref: './img/icons/map-pointer-icon.png',
                iconImageSize: [32, 48],
                iconImageOffset: [-16, -48],
                balloonLayout: BalloonLayout,
                balloonContentLayout: BalloonContentLayout,
                hideIconOnBalloonOpen: true,
                balloonAutoPan: true,
            });*/

        //collection.add(placemark);

        let obj = {
            type: 'Feature',
            id: item.id,
            type_obj: item.type,
            geometry: {
                type: 'Point',
                coordinates: coords
            },
            properties: {
                balloonContentHeader: item.name,
                balloonContent: "<p>Адрес: <span>"
                    + " " + item.address + "</span></p>"
                    + "<p>Телефон: <span>"
                    + item.phone + "</span></p>"
                    + "<p>Открыто до: <span>" + item.open_to.substr(0, 5) + "</span></p>"
                    + "<p class='" + (status ? "text-open" : "text-close") + "'>" + (status ? "Сейчас открыто" : "Сейчас закрыто") + "</p>",
                balloonContentFooter: "<p class='map-route' onclick='showRoute(" + coords[0] + ", " + coords[1] + ")'>Построить маршрут</p>",
            },
            options: {
                iconLayout: 'default#image',
                iconImageHref: './img/icons/map-pointer-icon.png',
                iconImageSize: [32, 48],
                iconImageOffset: [-16, -48],
                balloonLayout: BalloonLayout,
                balloonContentLayout: BalloonContentLayout,
                hideIconOnBalloonOpen: true,
                balloonAutoPan: true,
            }
        };

        objects.push(obj);


        submenuItem
            .appendTo(menu)
            .find('a')
            .bind('click', function () {
                // placemark.balloon.open();
                //obj.balloon.open();
                objectManager.objects.balloon.open(obj.id);
                return false;
            });
    }


    // ?
    $('#map').on('click', 'map-route', function(){
        console.log('route');
    });

    function init() {
        // console.log('init');
        const defaultCity = [41.311158, 69.279737]
        myMap = new ymaps.Map('map', {
            center: defaultCity,
            zoom: 12,
            controls: ['routePanelControl']
        }, {
            suppressMapOpenBlock: true
        });

        myMap.margin.setDefaultMargin(50);

        createZoomLayout();
        createBalloonLayout();
        createRoute();

        // var suggestView = new ymaps.SuggestView('suggest');

        // suggestView.events.add("select", function(e){
        //     console.log(e.get('item').value)

        //     var myGeocoder = ymaps.geocode(e.get('item').value);

        //     myGeocoder.then(
        //         function (res) {
        //             map.geoObjects.add(res.geoObjects);
        //             // Выведем в консоль данные, полученные в результате геокодирования объекта.
        //             console.log(res.geoObjects.get(0).properties.get('metaDataProperty').getAll());
        //         },
        //         function (err) {
        //             // Обработка ошибки.
        //         }
        //     );
        // })

        menu = $('<ol class="map-menu-list"></ol>');

        // collection = new ymaps.GeoObjectCollection();
        objects = [];

        for (var i = 0, l = menu_items.length; i < l; i++) {
            createMenu(menu_items[i]);
        }

        menu.appendTo($('.map-menu'));

        // navigator.geolocation.watchPosition(position => {
        //     const { latitude, longitude } = position.coords;
        //     console.log(latitude, longitude)

        //     console.log(myMap.geoObjects)
        //     myMap.geoObjects.add(new ymaps.Placemark([latitude, longitude]))

        //     // // Создаем инстанцию геометрии точки (указываем координаты).
        //     // var pointGeometry = new ymaps.geometry.Point([latitude, longitude])
        //     // // Создаем инстанцию геообъекта и передаем нашу геометрию в конструктор.
        //     // var placemark = new ymaps.GeoObject({ geometry: pointGeometry });

        //     // console.log(placemark)
        // });


        const selectMap = $(".ui-select")

        selectMap.change(function() {
            const city = $(this).find('option:selected').attr('id')
            const center = $(this).find('option:selected').attr('data-center')

            $('.map-menu-list li').each(function() {
                const mapGroup = $(this).attr('data-cityID');

                if(city === undefined || mapGroup === city) {
                    $(this).show();

                    if(mapGroup === city) {
                        const coordinates = center.split(',')
                        myMap.setCenter(coordinates, 13);
                    } else {
                        myMap.setCenter(defaultCity, 10)
                    }
                } else {
                    $(this).hide();
                }
            });
        })

        // myMap.geoObjects.add(collection);
        objectManager = new ymaps.ObjectManager({
            clusterize: false
        });

        objectManager.add(objects);
        myMap.geoObjects.add(objectManager);

        myMap.setBounds(myMap.geoObjects.getBounds());

        // про фильтрацию
        // https://yandex.ru/dev/maps/jsbox/2.1/object_manager_filter/

        myMap.controls.add(zoomControl, {
            float: 'none',
            position: {
                bottom: 15,
                left: 15
            }
        });

        // Создадим 5 пунктов выпадающего списка.
        let listBoxItems = ['Бар/Паб', 'Бассейн', 'Ресторан', 'Современное кафе', 'Традиционное кафе', 'Кафе', 'Караоке', 'Ночной клуб']
                .map(function (title, key) {
                    return new ymaps.control.ListBoxItem({
                        data: {
                            id: (key + 1),
                            content: title
                        },
                        state: {
                            selected: true
                        }
                    })
                }),
            reducer = function (filters, filter) {
                //filters[filter.data.get('content')] = filter.isSelected();
                filters[filter.data.get('id')] = filter.isSelected();
                return filters;
            },

            // Теперь создадим список, содержащий 5 пунктов.
            listBoxControl = new ymaps.control.ListBox({
                data: {
                    content: 'Фильтр',
                    title: 'Фильтр'
                },
                items: listBoxItems,
                state: {
                    // Признак, развернут ли список.
                    expanded: true,
                    filters: listBoxItems.reduce(reducer, {})
                }
            });
        myMap.controls.add(listBoxControl, {
            float: 'none',
            position: {
                top: 15,
                right: 15
            }
        });


        // Добавим отслеживание изменения признака, выбран ли пункт списка.
        listBoxControl.events.add(['select', 'deselect'], function (e) {
            let listBoxItem = e.get('target');
            let filters = ymaps.util.extend({}, listBoxControl.state.get('filters'));
            //filters[listBoxItem.data.get('content')] = listBoxItem.isSelected();
            filters[listBoxItem.data.get('id')] = listBoxItem.isSelected();
            listBoxControl.state.set('filters', filters);
        });

        let filterMonitor = new ymaps.Monitor(listBoxControl.state);
        filterMonitor.add('filters', function (filters) {
            // Применим фильтр.
            objectManager.setFilter(getFilterFunction(filters));

            $('.map-menu-list li').each(function (index, elem){
                let elemType = $(elem).data('type');
                if (filters[elemType]) {
                    $(elem).show();
                } else {
                    $(elem).hide();
                }
            });

        });

        function getFilterFunction(categories) {
            return function (obj) {
                let content = obj.type_obj;
                return categories[content]
            }
        }

    }



    function createZoomLayout() {
        ZoomLayout = ymaps.templateLayoutFactory.createClass("<div>" +
            "<div class='btn btn-map-zoom btn-map-zoom--in' id='btn-map-zoom-in'></div><br>" +
            "<div class='btn btn-map-zoom btn-map-zoom--out' id='btn-map-zoom-out'></div>" +
            "</div>", {

            build: function () {
                ZoomLayout.superclass.build.call(this);

                this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
                this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);

                $('#btn-map-zoom-in').bind('click', this.zoomInCallback);
                $('#btn-map-zoom-out').bind('click', this.zoomOutCallback);
            },

            clear: function () {
                $('#btn-map-zoom-in').unbind('click', this.zoomInCallback);
                $('#btn-map-zoom-out').unbind('click', this.zoomOutCallback);

                ZoomLayout.superclass.clear.call(this);
            },

            zoomIn: function () {
                let map = this.getData().control.getMap();
                map.setZoom(map.getZoom() + 1, {
                    checkZoomRange: true,
                    duration: 200
                });
            },

            zoomOut: function () {
                let map = this.getData().control.getMap();
                map.setZoom(map.getZoom() - 1, {
                    checkZoomRange: true,
                    duration: 200
                });
            }
        });

        zoomControl = new ymaps.control.ZoomControl({options: {layout: ZoomLayout}});
    }

    function createBalloonLayout() {
        BalloonLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="map-balloon">' +
            '<a class="map-balloon__close-btn" href="#">&times;</a>' +
            '<div class="map-balloon__arrow"></div><div>' +
            '$[[options.contentLayout]]' +
            '</div>' +
            balloonSvgBg +
            '</div>', {

                build: function () {
                    this.constructor.superclass.build.call(this);

                    this._$element = $('.map-balloon', this.getParentElement());

                    this.applyElementOffset();

                    this._$element.find('.map-balloon__close-btn, .map-route')
                        .on('click', $.proxy(this.onCloseClick, this));
                },

                clear: function () {
                    this._$element.find('.map-balloon__close-btn')
                        .off('click');

                    this.constructor.superclass.clear.call(this);
                },

                onSublayoutSizeChange: function () {
                    BalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);

                    if(!this._isElement(this._$element)) {
                        return;
                    }

                    this.applyElementOffset();

                    this.events.fire('shapechange');
                },

                applyElementOffset: function () {
                    this._$element.css({
                        left: -this._$element[0].offsetWidth,
                        top: -(this._$element[0].offsetHeight + this._$element.find('.map-balloon__arrow')[0].offsetHeight)
                    });
                },

                onCloseClick: function (e) {
                    e.preventDefault();

                    this.events.fire('userclose');
                },

                getShape: function () {
                    if(!this._isElement(this._$element)) {
                        return BalloonLayout.superclass.getShape.call(this);
                    }

                    let position = this._$element.position();

                    return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
                        [position.left, position.top], [
                            position.left + this._$element[0].offsetWidth,
                            position.top + this._$element[0].offsetHeight + this._$element.find('.map-balloon__arrow')[0].offsetHeight
                        ]
                    ]));
                },

                _isElement: function (element) {
                    return element && element[0] && element.find('.map-balloon__arrow')[0];
                }
            });

        BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="map-balloon__header">$[properties.balloonContentHeader]</div>' +
            '<div class="map-balloon__content">$[properties.balloonContent]</div>' +
            '<div class="map-balloon__footer">$[properties.balloonContentFooter]</div>'
        );
    }

    function createRoute() {
        routeControl = myMap.controls.get('routePanelControl');


        routeControl.options.set({
            autofocus: false,
        });

        routeControl.routePanel.state.set({
            type: 'masstransit',
            expanded: false
        });

        let closeButton = new ymaps.control.Button({
            data: {content: "Отменить", address: "Отменить"},
            options: {selectOnClick: false, maxWidth: 160}
        });

        closeButton.events.add('click', function () {
            $('.ymaps-2-1-75-controls__control_toolbar').removeClass('ymaps-2-1-75-controls__control_toolbar--show');

            routeControl.routePanel.state.set({
                to: "",
                from: ""
            });

            myMap.geoObjects.remove(routeControl);
        });

        myMap.controls.add(closeButton);

        routeControl.routePanel.options.set({
            allowSwitch: false,
            reverseGeocoding: true,
            types: {
                auto: true,
                masstransit: true,
                pedestrian: true,
                bicycle: true,
                taxi: true
            }
        });

        let multiRoutePromise = routeControl.routePanel.getRouteAsync();

        multiRoutePromise.then(function(multiRoute) {
            // Подписка на событие обновления мультимаршрута.
            multiRoute.model.events.add('requestsuccess', function() {
                // Получение ссылки на активный маршрут.
                let activeRoute = multiRoute.getActiveRoute();
                // Когда панель добавляется на карту, она
                // создает маршрут с изначально пустой геометрией.
                // Только когда пользователь выберет начальную и конечную точки,
                // маршрут будет перестроен с непустой геометрией.
                // Поэтому для избежания ошибки нужно добавить проверку,
                // что маршрут не пустой.
                // console.log('zxzx');
                /*
                console.log($('.ymaps-2-1-79-route-panel__clear-row'));
                $('.get_directions').remove();
                console.log(multiRoute);
                $('.ymaps-2-1-79-route-panel__clear-row').append('<a href="yandexnavi://build_route_on_map?lat_to=55.70&lon_to=37.64" class="get_directions">Проложить маршрут в навигаторе</a>');
*/
                const from = routeControl.routePanel.state._data.from
                const to = routeControl.routePanel.state._data.to

                // console.log(from.geometry.getCoordinates())
                let fromCoord
                let toCoord

                ymaps.geocode(from).then(function(res) {
                    return fromCoord = res.geoObjects.get(0).geometry._coordinates
                });

                ymaps.geocode(to).then(function(res) {
                    toCoord = res.geoObjects.get(0).geometry._coordinates

                    $('.get_directions').remove();
                    $('.ymaps-2-1-79-route-panel__clear-row')
                    .append('<a href="yandexnavi://build_route_on_map?lat_to=' + toCoord[0] + '&lon_to=' + toCoord[1] + '" class="get_directions">Проложить маршрут в навигаторе</a>');
                });


                if (activeRoute) {
                    // $('.ymaps-2-1-79-route-panel__clear-row').append('<a href="#">Проложить маршрут в навигаторе</a>');
                    // Вывод информации об активном маршруте.
                    //console.log("Длина: " + activeRoute.properties.get("distance").text);
                    //console.log("Время прохождения: " + activeRoute.properties.get("duration").text);
                }
            });
        }, function (err) {
            console.log(err);
        });
    }

    $('.map-search-block__input').on('keyup', function () {
        let input = $(this),
            value = input.val().trim().toLowerCase(),
            regexp = new RegExp(value);

        let items = $('.map-menu-list li');

        if (value !== "") {
            items.each(function (index, object) {
                object = $(object);
                let address = object.data('address').toLowerCase();

                if(regexp.test(address))
                    object.show();
                else
                    object.hide();
            });
        } else {
            items.show();
        }
    });

    $('.map-search-block__input').on('focus', function () {
        $(this)
            .closest('.map-search-block')
            .find('.map-menu')
            .addClass('map-menu--show');
    });

    $('.map-search-block__input').on('blur', function () {
        let input = $(this);
        setTimeout(function () {
            input
                .closest('.map-search-block')
                .find('.map-menu')
                .removeClass('map-menu--show');
        }, 200);
    });


    //$('.my-datepicker')
    function addZero(num) {
        if (num >= 0 && num <= 9) {
            return '0' + num;
        } else {
            return num;
        }
    }

    const options = $('.my-datepicker-date').data('options');
    // const fpd = flatpickr('.my-datepicker-date', {
    //     "disableMobile": true,
    //     "minDate": "today",
    //     "enable": options.enable,
    //     onDayCreate: function(dObj, dStr, fp, dayElem){
    //         // console.log(dStr);
    //         let strDate =  addZero(dayElem.dateObj.getFullYear()) + '-' +
    //             addZero(dayElem.dateObj.getMonth() + 1) + '-' +
    //             addZero(dayElem.dateObj.getDate());

    //         if (options.enableHour[strDate] !== undefined) {
    //             dayElem.classList.add("excursion-day");
    //         }

    //     },
    //     onChange: function(selectedDates, dateStr, instance) {
    //         $('select.input').prop('disabled', false);

    //         $('select.input option').each(function(ind, elem) {
    //             $(elem).hide();
    //         });

    //         for (let i =0, len = options.enableHour[dateStr].length; i < len; i++)
    //         {
    //             let curHour = options.enableHour[dateStr][i];
    //             $('select.input option[value="' + curHour+ '"]').show();
    //         }
    //     },
    // });

    if(document.querySelector('.faq-splide')) {
        new Splide( '.faq-splide', {
            direction   : 'ttb',
            perMove: 3,
            height      : '527px',
            autoHeight: true,
            wheel       : true,
            focus     : 'center',
            // perPage: 4,
            // perMove: 1
        }).mount();
    }
});


window.addEventListener("DOMContentLoaded", function() {
    [].forEach.call( document.querySelectorAll('input[name="phone"]'), function(input) {
        var keyCode;
        function mask(event) {
            event.keyCode && (keyCode = event.keyCode);
            let pos = this.selectionStart;
            if (pos < 3) event.preventDefault();

            let matrix = "+998 __ ___ __ __",
                i = 0,
                def = matrix.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, ""),
                new_value = matrix.replace(/[_\d]/g, function(a) {
                    return i < val.length ? val.charAt(i++) || def.charAt(i) : a
                });

            i = new_value.indexOf("_");

            if (i != -1) {
                i < 5 && (i = 3);
                new_value = new_value.slice(0, i)
            }

            let reg = matrix.substr(0, this.value.length).replace(/_+/g,
                function(a) {
                    return "\\d{1," + a.length + "}"
                }).replace(/[+()]/g, "\\$&");

            reg = new RegExp("^" + reg + "$");

            if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
            if (event.type === "blur" && this.value.length < 5)  this.value = ""
        }

        input.addEventListener("input", mask, false);
        input.addEventListener("focus", mask, false);
        input.addEventListener("blur", mask, false);
        input.addEventListener("keydown", mask, false)

    });

    function showToast() {
        let x = document.getElementById("snackbar");
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }

    $('.copy_data').click(function(){
        let data_copy = $(this).data('copy');
        console.log(data_copy);

        navigator.clipboard.writeText(data_copy)
            .then(() => {
                console.log('Text copied to clipboard');
                showToast();
            })
            .catch(err => {
                console.error('Error in copying text: ', err);
            });
    });

    let lazyVideos = [].slice.call(document.querySelectorAll("video.lazy"));

    if ("IntersectionObserver" in window) {
        let lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(video) {
                if (video.isIntersecting) {
                    for (let source in video.target.children) {
                        let videoSource = video.target.children[source];
                        if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
                            videoSource.src = videoSource.dataset.src;
                        }
                    }

                    video.target.load();
                    video.target.classList.remove("lazy");
                    lazyVideoObserver.unobserve(video.target);
                }
            });
        });

        lazyVideos.forEach(function(lazyVideo) {
            lazyVideoObserver.observe(lazyVideo);
        });
    }

    // console.log('zxxx');
    let lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

    if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.srcset = lazyImage.dataset.srcset;
                    lazyImage.classList.remove("lazy");
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        // Possibly fall back to event handlers here
    }

    $('.verify-input').on('input change paste', function(event){
        let formControl = $(event.target);
        formControl.val(formControl.val().replace(/[^0-9.]+/g, ""));
    });


    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }

        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }

    function getCookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }

        return null;
    }

    function eraseCookie(name) {
        document.cookie = name+'=; Max-Age=-99999999;';
    }


    let Ye = function () {
        // console.log('AnnouncementOnce', localStorage.getItem("AnnouncementOnce"));

        let cookieModal = document.querySelector(".coockie");
        let yearsModal = document.querySelector(".modal");

        document.addEventListener("input", function (e) {
            let t = Array.from(
                    document.querySelectorAll(
                        ".verify-input"
                    )
                )
                .map(function (e) {
                    return e.value;
                })
                .join("");

            let n = new Date().getFullYear();

            // console.log(t);
            if (4 == t.length && (parseInt(t) <= n - 21)) {
                localStorage.setItem(
                    "yearsModal",
                    "1"
                );

                yearsModal.classList.add("close");

                document
                    .querySelector("html")
                    .classList.remove("no-scroll");
            } else {
                document
                    .querySelector(".no-verify")
                    .classList.add("active");
            }
        });



        $(".btn-coockie").each(function (i, t) {
            t.addEventListener("click", function () {

                if($(this).hasClass('agree')) {
                    setCookie('cookieAgree', '1', 365);
                } else {
                    localStorage.setItem(
                        "AnnouncementOnce",
                        "1"
                    );
                }

                cookieModal.classList.add("close");
                window.location.reload();
            });
        });

        if ("1" === localStorage.getItem("yearsModal")) {
            yearsModal.classList.add("hidden");

            document
                .querySelector("html")
                .classList.remove("no-scroll");
        }

        if ("1" === localStorage.getItem("AnnouncementOnce") || getCookie('cookieAgree') === '1') {
            cookieModal.classList.add("close");
        }
    };

    Ye();


});

// const url = 'https://api.lbs.yandex.net/geolocation';
// const headers = {
//     'Host': 'api.lbs.yandex.net',
//     'Content-Type': 'application/json'
// };

// const data = {
//     "common": {
//         "version": "1.0",
//         "api_key": "f69d2801-1dac-4708-9737-bc4b1dfd85da"
//     },
//     "gsm_cells": [
//         {
//             "countrycode": 250,
//             "operatorid": 2,
//             "cellid": 197403650,
//             "lac": 9900,
//             "signal_strength": -80,
//             "age": 1000
//         }
//     ],
//     "wifi_networks": [
//         {
//             "mac": "2CD02D814C80",
//             "signal_strength": -68,
//             "age": 500,
//         },
//         {
//             "mac": "E4AA5DE28CD0",
//             "signal_strength": -60,
//             "age": 500,
//         }
//     ],
//     "ip": {
//         "address_v4": "95.108.173.231"
//     }
// };

// fetch(url, {
//     method: 'POST',
//     headers: headers,
//     body: JSON.stringify(data)
// })
// .then(response => response.json())
// .then(data => {
//     console.log(data);
// })
// .catch(error => {
//     console.error('Error:', error);
// });