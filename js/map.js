// Константы
var AMOUNT_OF_OBJECTS = 8;

var ANNOUNCEMENT_AVATAR_PHOTOS = [];
for (i = 0; i < AMOUNT_OF_OBJECTS; i++) {
  ANNOUNCEMENT_AVATAR_PHOTOS[i] = i + 1;
}

var ANNOUNCEMENT_TYPES = {
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

var ANNOUNCEMENT_CHECKINS = [
  '12:00', '13:00', '14:00'
];

var ANNOUNCEMENT_FEATURES = [
   'wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'
];

var ANNOUNCEMENT_CHECKOUTS = ANNOUNCEMENT_CHECKINS.slice();

var ANNOUNCEMENT_TITLES = [
  'Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало поколено в воде'
];

var ESC_CODE = 27;




// Функции
/*
Отдает случайное целое число из заданого диапазона.
Вход: мин и макс диапазоны.
Выход: случайное целое число из заданого диапазона
*/
var getRandomOfMinMax = function(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
};


/*
Возвращает случайный элемент массива. Если на входе 2-м параметром указано true, то элемент, который выводится, будет удален из входящего массива.
Вход: массив и true/false.
Выход: случайный элемент.
*/
var getRandomElement = function(array, unique) {
  if (array.length === 0) {
    return 'Отсутствует';
  }
  var index = getRandomOfMinMax(0, array.length - 1);
  var element = array[index];
  if (unique === true) {
    array.splice(index, 1);
  }
  return element;
};


/*
Формирует новый массив из элементов старого массива. Количество элементов случайное, но не меньше одного, и не больше количества элементов входящего массива. Новый массив не имеет повторяющихся элементов.
Вход: массив.
Выход: новый массив
*/
var getRandomArray = function(array) {
  var newArrayLength = getRandomOfMinMax(1, array.length);
  var newArray = [];
  var newElement;

  for (var i = 0; i < newArrayLength; i++) {
    if (newArray.length > 0) {
      for (var j = 0; j < newArray.length; j++) {
        newElement = getRandomElement(ANNOUNCEMENT_FEATURES);
        while (!(newArray.indexOf(newElement) === -1)) {
          newElement = getRandomElement(ANNOUNCEMENT_FEATURES);
        }
      }
    }
    else {
      newElement = getRandomElement(ANNOUNCEMENT_FEATURES);
    }
    newArray.push(newElement);
  }
  return newArray;
};


/*
Преобразует число в строковый формат и добавляет впереди '0' если число от 0 до 9.
Вход: число.
Выход: число в строком формате.
Пример: вход = 8; выход = '08'.
*/
var getZeroFirst = function(number) {
  if (number >= 0 && number <= 9) {
    number = '0' + number.toString(10);
  }
  else {
    number = number.toString(10);
  }
  return number;
};


/*
Создает путь к файлу аватара на основе номера аватара.
Вход: число в строковом формате.
Выход: строка, содержащая путь к файлу аватара
*/
var getAnnouncementAvatars = function(stroke) {
  return 'img/avatars/user' + stroke + '.png';
};


/*
Создает объект, поля которого (в основном) генерируются другими функциями.
Вход: ничего.
Выход: объект
*/
var createAnnouncement = function() {
  var announcement = {
    author: {
      avatar: getAnnouncementAvatars(getZeroFirst(getRandomElement(ANNOUNCEMENT_AVATAR_PHOTOS, true)))
    },
    offer: {
      title: getRandomElement(ANNOUNCEMENT_TITLES, true),
      address: '',
      price: getRandomOfMinMax(1000, 1000000),
      type: getRandomElement(Object.keys(ANNOUNCEMENT_TYPES)),
      rooms: getRandomOfMinMax(1, 5),
      guests: getRandomOfMinMax(1, 10),
      checkin: getRandomElement(ANNOUNCEMENT_CHECKINS),
      checkout: getRandomElement(ANNOUNCEMENT_CHECKOUTS),
      features: getRandomArray(ANNOUNCEMENT_FEATURES),
      description: '',
      photos: []
    },
    location: {
      x: getRandomOfMinMax(300, 900),
      y: getRandomOfMinMax(100, 500)
    }
  };

  announcement.offer.address = announcement.location.x + ', ' + announcement.location.y;

  return announcement;
};


/*
Создает DOM-элемент пин-кнопки.
Вход: объект объявления.
Выход: DOM-элемент пин кнопки
*/
var renderMapPin = function(announcement) {
  var mapPin = mapPinTemplate.cloneNode(true);
  mapPin.style.left = announcement.location.x + 25 + 'px';
  mapPin.style.top = announcement.location.y + 50 + 'px';
  mapPin.querySelector('img').src = announcement.author.avatar;

  return mapPin;
};


/*
Создает DOM-элемент карточки объявления
Вход: объект объявления.
Выход: DOM-элемент карточки объявления
*/
var renderMapCard = function(announcement) {
  var mapCard = mapCardTemplate.cloneNode(true);
  mapCard.querySelector('.popup__title').textContent = announcement.offer.title;
  mapCard.querySelector('.popup__text--address').textContent = announcement.offer.address;
  mapCard.querySelector('.popup__text--price').textContent = announcement.offer.price + ' ' + '₽/ночь';
  mapCard.querySelector('.popup__type').textContent = ANNOUNCEMENT_TYPES[announcement.offer.type];

  if (announcement.offer.rooms === 1) {
    mapCard.querySelector('.popup__text--capacity').textContent = announcement.offer.rooms + ' комната для ' + announcement.offer.guests + ' гостей';
  } else {
    mapCard.querySelector('.popup__text--capacity').textContent = announcement.offer.rooms + ' комнаты для ' + announcement.offer.guests + ' гостей';
  }

  mapCard.querySelector('.popup__text--time').textContent = 'Заезд после ' +  announcement.offer.checkin + ', выезд до ' + announcement.offer.checkout;

  var mapCardFeatures = mapCard.querySelector('.popup__features');
  var mapCardFeaturesItems = mapCard.querySelectorAll('.popup__feature');
  for (var i = 0; i < mapCardFeaturesItems.length; i++) {
    mapCardFeatures.removeChild(mapCardFeaturesItems[i]);
  }
  for (var i = 0; i < announcement.offer.features.length; i++) {
    var mapCardNewFeature = document.createElement('li');
    mapCardNewFeature.classList.add('feature');
    mapCardNewFeature.classList.add('feature--' + announcement.offer.features[i]);
    mapCardFeatures.appendChild(mapCardNewFeature);
  }

  mapCard.querySelector('.popup__description').textContent = announcement.offer.description;
  mapCard.querySelector('.popup__avatar').src = announcement.author.avatar;

  return mapCard;
};


/*
Перемещает карточку в карту. Мягко, то есть с помощью DocFragment.
Вход: карточка.
*/
var paintMapCard = function(mapCard) {
  mapCardFragment.appendChild(mapCard);
  map.appendChild(mapCardFragment);
};


/*
Удаляет карточку из карты
Вход: карточка
*/
var removeMapCard = function(mapCard) {
  mapCardFragment.appendChild(mapCard);
  mapCardFragment.removeChild(mapCard);
};


/*
Создает массив пинов. Именно массив.
Выход: массив пинов.
*/
var createPinsArray = function() {
  var mapPins = mapPinList.querySelectorAll('.map__pin');
  mapPins = Array.prototype.slice.call(mapPins);
  for (var i = 0; i < mapPins.length; i++) {
    if (mapPins[i].classList.contains('map__pin--main')) {
      mapPins.splice(i, 1);
    }
  }

  return mapPins;
};


/*
Деактивирует все активные пины.
Вход: массив пинов.
*/
var madeAllPinsDeactive = function(mapPins) {
  for (var i = 0; i < mapPins.length; i++) {
    if (mapPins[i].classList.contains('map__pin--active')) {
      mapPins[i].classList.remove('map__pin--active');
    }
  }
};


/*
Делает пин активным.
Вход: пин.
*/
var madePinActive = function(mapPin) {
  mapPin.classList.add('map__pin--active');
};


/*
Открывает попап.
*/
var openPopup = function() {
  if (mapCard.classList.contains('hidden')) {
    mapCard.classList.remove('hidden');
  }

  document.addEventListener('keydown', onMapCardEscPress);
  mapCard.querySelector('.popup__close').addEventListener('click', onMapCardCloseClick);
};


/*
Закрывает попап.
*/
var closePopup = function() {
  if (!mapCard.classList.contains('hidden')) {
    mapCard.classList.add('hidden');
  }
  document.removeEventListener('keydown', onMapCardEscPress);
};


/*
Снимает со всех инпутов(селектов и прочих) красную рамку и задает ее только инвалидным элементам.
Вход: массив элементов
*/
var madeRedBorderToInvalidElem = function(elemsArray) {
  for (var i = 0; i < elemsArray.length; i++) {
    elemsArray[i].style.borderColor = '';

    if (elemsArray[i].validity.valid === false) {
      elemsArray[i].style.borderColor = 'red';
    }
  }
};




/* Функции-обработчики */
/*
Обрабатывает отпуск мыши на основном пине.
*/
var onMapMainPinMouseup = function() {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  for (var i = 0; i < adFormFieldsets.length; i++) {
    adFormFieldsets[i].disabled = false;
  }
  mapPinList.appendChild(mapPinsFragment);
};


/*
Обрабатывает клик на любой из пинов (кроме основного). Используется делегирование.
*/
var onMapPinsClick = function(event) {
  var mapPins = createPinsArray();
  var target = event.target;

  for (var i = 0; i < mapPins.length; i++) {
    if (target === mapPins[i] || mapPins[i].contains(target)) {
      if (map.contains(map.querySelector('.map__card'))) {
        removeMapCard(mapCard);
      }
      mapCard = renderMapCard(announcements[i]);
      paintMapCard(mapCard);
      openPopup();

      madeAllPinsDeactive(mapPins);
      madePinActive(mapPins[i]);
    }
  }
};

/*
Обрабатывает esc на открытой карточке
*/
var onMapCardEscPress = function(event) {
  if (event.keyCode === ESC_CODE) {
    closePopup();

    var mapPins = createPinsArray();
    for (var i = 0; i < mapPins.length; i++) {
      madeAllPinsDeactive(mapPins);
    }
  }
};


/*
Обрабатывает клик по кресту
*/
var onMapCardCloseClick = function() {
  closePopup();

  var mapPins = createPinsArray();
  for (var i = 0; i < mapPins.length; i++) {
    madeAllPinsDeactive(mapPins);
  }
}


/*
Обрабатывает изменение на селекте со временем заезда
*/
var onTimesInSelectChange = function() {
  timeOutSelect.value = timeInSelect.value;
};


/*
Обрабатывает изменение на селекте со временем отъезда
*/
var onTimesOutSelectChange = function() {
  timeInSelect.value = timeOutSelect.value;
};


/*
Обрабатывает изменение селекта с типами жилья
*/
var onTypeSelectChange = function() {
  if (typeSelect.value === 'bungalo') {
    priceInput.min = 0;
  }
  else if (typeSelect.value === 'flat'){
    priceInput.min = 1000;
  }
  else if (typeSelect.value === 'house'){
    priceInput.min = 5000;
  }
  else if (typeSelect.value === 'palace'){
    priceInput.min = 10000;
  }
};


/*
Обрабатывает изменение кол-ва комнат
*/
var onRoomSelectChange = function() {
  if (roomNumberSelect.value === '1') {
    capacitySelect.value = 1;
  }
  else if (roomNumberSelect.value === '2') {
    capacitySelect.value = 2;
  }
  else if (roomNumberSelect.value === '3') {
    capacitySelect.value = 3;
  }
  else if (roomNumberSelect.value === '100') {
    capacitySelect.value = 0;
  }
};


/*
Обрабатывает инвалидность формы
*/
var onAdFormInvalid = function(event) {
  madeRedBorderToInvalidElem(adFormInputs);
};




var announcements = [];

for (var i = 0; i < AMOUNT_OF_OBJECTS; i++) {
  announcements[i] = createAnnouncement();
}

var map = document.querySelector('.map');
var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var mapMainPin = map.querySelector('.map__pin--main');

var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var mapPinsFragment = document.createDocumentFragment();
for (var i = 0; i < announcements.length; i++) {
  mapPinsFragment.appendChild(renderMapPin(announcements[i]));
}
var mapPinList = document.querySelector('.map__pins');

var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
var mapCardFragment = document.createDocumentFragment();
var mapCard;


var timeInSelect = adForm.querySelector('#timein');
var timeOutSelect = adForm.querySelector('#timeout');
var typeSelect = adForm.querySelector('#type');
var roomNumberSelect = adForm.querySelector('#room_number');
var capacitySelect = adForm.querySelector('#capacity');
var priceInput = adForm.querySelector('#price');
var titleInput = adForm.querySelector('#title');
var addressInput = adForm.querySelector('#address');
var adFormInputs = adForm.querySelectorAll('input');

roomNumberSelect.value = 2;
capacitySelect.value = roomNumberSelect.value;



mapMainPin.addEventListener('mouseup', onMapMainPinMouseup);
mapPinList.addEventListener('click', onMapPinsClick);

timeInSelect.addEventListener('change', onTimesInSelectChange);
timeOutSelect.addEventListener('change', onTimesOutSelectChange);
typeSelect.addEventListener('change', onTypeSelectChange);
roomNumberSelect.addEventListener('change', onRoomSelectChange);

adForm.addEventListener('invalid', onAdFormInvalid, true);
