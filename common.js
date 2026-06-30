const DATA_URL = 'data.json';

let appData = null;
let dataLoadPromise = null;

const EMBEDDED_DATA = {
  "organization": "Жилищно-коммунальная служба города Загребенки",
  "shortName": "ЖКС Загребенки",
  "emergencyPhone": "+380-222-31-27",
  "contacts": {
    "phone": "+380-222-31-00",
    "email": "info@zhabg.ru",
    "address": "г. Загребенки, ул. Центральная, д. 1",
    "schedule": "Пн–Пт: 8:00 – 17:00, перерыв 12:00–13:00",
    "requisites": "ИНН 1234567890, КПП 123456001, ОГРН 1234567890123\nр/с 40702810123450000001 в Банке «Загребенки», БИК 044525000"
  },
  "about": {
    "history": "Жилищно-коммунальная служба города Загребенки основана в 1995 году. За более чем 25 лет работы ЖКС Загребенки зарекомендовала себя как надёжный партнёр в сфере жилищно-коммунального хозяйства. Сегодня под управлением службы находятся 4 района, более 100 многоквартирных домов и 10 социальных объектов.",
    "mission": "Обеспечение комфортных и безопасных условий проживания жителей города Загребенки путём качественного предоставления жилищно-коммунальных услуг.",
    "fullName": "Муниципальное унитарное предприятие «Жилищно-коммунальная служба города Загребенки»"
  },
  "leadership": [
    { "name": "Соколов Александр Владимирович", "position": "Генеральный директор", "phone": "+380-222-31-01", "email": "director@zhabg.ru" },
    { "name": "Михайлова Елена Петровна", "position": "Заместитель директора по экономике", "phone": "+380-222-31-02", "email": "economy@zhabg.ru" },
    { "name": "Ковалёв Сергей Иванович", "position": "Главный инженер", "phone": "+380-222-31-03", "email": "engineer@zhabg.ru" },
    { "name": "Васильева Ольга Николаевна", "position": "Начальник юридического отдела", "phone": "+380-222-31-04", "email": "legal@zhabg.ru" },
    { "name": "Зайцев Дмитрий Алексеевич", "position": "Начальник аварийно-диспетчерской службы", "phone": "+380-222-31-27", "email": "dispetcher@zhabg.ru" }
  ],
  "licenses": [
    { "number": "1234567890", "type": "Лицензия на управление многоквартирными домами", "date": "15.03.2023", "authority": "Государственная жилищная инспекция" }
  ],
  "documents": [
    { "id": 1, "name": "Устав предприятия", "file": "ustav.pdf" },
    { "id": 2, "name": "Отчёт о финансово-хозяйственной деятельности за 2025 год", "file": "otchet_2025.pdf" },
    { "id": 3, "name": "План текущего ремонта на 2026 год", "file": "plan_remont_2026.pdf" },
    { "id": 4, "name": "Договор управления многоквартирным домом (типовая форма)", "file": "dogovor_upravleniya.pdf" },
    { "id": 5, "name": "Информация о тарифах на коммунальные услуги", "file": "tarify_2026.pdf" },
    { "id": 6, "name": "Отчёт о выполненных работах за 2025 год", "file": "raboty_2025.pdf" }
  ],
  "services": [
    { "name": "Содержание и текущий ремонт общего имущества", "description": "Уборка лестничных клеток, ремонт подъездов, обслуживание инженерных систем" },
    { "name": "Вывоз твёрдых коммунальных отходов", "description": "Организация сбора и вывоза мусора с придомовых территорий" },
    { "name": "Благоустройство придомовых территорий", "description": "Озеленение, установка скамеек, ремонт тротуаров, освещение" },
    { "name": "Аварийно-диспетчерское обслуживание", "description": "Круглосуточный приём и обработка заявок по телефону +380-222-31-27" },
    { "name": "Подготовка к отопительному сезону", "description": "Промывка и опрессовка систем отопления, ремонт тепловых узлов" },
    { "name": "Платные услуги", "description": "Вызов сантехника, электрика, сварочные работы, замена стояков" }
  ],
  "tariffs": [
    { "service": "Содержание жилья", "unit": "ZD/м²", "price": "14,47" },
    { "service": "Текущий ремонт", "unit": "ZD/м²", "price": "4,67" },
    { "service": "Вывоз ТКО", "unit": "ZD/чел.", "price": "56,11" },
    { "service": "Холодное водоснабжение", "unit": "ZD/м³", "price": "24,09" },
    { "service": "Горячее водоснабжение", "unit": "ZD/м³", "price": "77,24" },
    { "service": "Отопление", "unit": "ZD/Гкал", "price": "1 395,52" },
    { "service": "Электроэнергия", "unit": "ZD/кВт·ч", "price": "3,30" }
  ],
  "faq": [
    { "question": "Как передать показания счётчиков?", "answer": "Воспользуйтесь формой «Передать показания» на главной странице или обратитесь в ваш участок по телефону." },
    { "question": "Куда обращаться при аварии?", "answer": "Круглосуточная аварийно-диспетчерская служба: +380-222-31-27." },
    { "question": "Как заключить договор управления?", "answer": "Обратитесь в отдел по работе с населением по адресу ул. Центральная, д. 1, каб. 12." },
    { "question": "Как оформить субсидию?", "answer": "Субсидии оформляются через МФЦ или портал «Госуслуги». Подробную консультацию можно получить в ЖКС." },
    { "question": "Где узнать график отключений?", "answer": "График публикуется в разделе «Плановые отключения» на нашем сайте и на информационных стендах в подъездах." },
    { "question": "Как оставить заявку на ремонт?", "answer": "Заполните форму «Заявка на ремонт» на сайте или позвоните в диспетчерскую службу." }
  ],
  "vacancies": [
    { "title": "Слесарь-сантехник", "requirements": "Опыт работы от 1 года, наличие удостоверения", "salary": "от 25 632 ZD", "department": "Кировский ЖК №1" },
    { "title": "Электромонтёр", "requirements": "Группа допуска не ниже III, образование среднее специальное", "salary": "от 28 480 ZD", "department": "Ленинский ЖК №2" },
    { "title": "Уборщик служебных помещений", "requirements": "Ответственность, исполнительность", "salary": "от 17 088 ZD", "department": "Администрация" },
    { "title": "Инженер ПТО", "requirements": "Высшее техническое образование, опыт работы от 2 лет", "salary": "от 31 328 ZD", "department": "Администрация" }
  ],
  "repairs": [
    { "year": 2026, "type": "текущий", "address": "ул. Кирова, д. 5", "scope": "Ремонт кровли", "status": "запланирован", "period": "июль–август" },
    { "year": 2026, "type": "текущий", "address": "ул. Самарская, д. 10", "scope": "Замена стояков ХВС", "status": "в работе", "period": "июнь–июль" },
    { "year": 2026, "type": "капитальный", "address": "ул. Днепровская, д. 15", "scope": "Капитальный ремонт фасада", "status": "запланирован", "period": "сентябрь–октябрь" },
    { "year": 2026, "type": "капитальный", "address": "ул. Ярославская, д. 3", "scope": "Замена лифтового оборудования", "status": "проект", "period": "ноябрь–декабрь" }
  ],
  "gallery": [
    { "src": "gallery_01.jpg", "caption": "Субботник во дворе на ул. Кирова" },
    { "src": "gallery_02.jpg", "caption": "Ремонт подъезда на ул. Самарской" },
    { "src": "gallery_03.jpg", "caption": "Благоустройство детской площадки" }
  ],
  "districts": [
    {
      "id": 1, "name": "ЖКС №1 Кировского района", "address": "ул. Кирова, д. 10", "phone": "+380-222-31-11",
      "head": "Иванов Иван Иванович", "headSchedule": "Вт, Чт 14:00–16:00",
      "streets": ["ул. Кирова", "ул. Парковая"],
      "homes": ["ул. Кирова, д. 1","ул. Кирова, д. 2","ул. Кирова, д. 3","ул. Кирова, д. 4","ул. Кирова, д. 5","ул. Кирова, д. 6","ул. Кирова, д. 7","ул. Кирова, д. 8","ул. Кирова, д. 9","ул. Кирова, д. 10","ул. Кирова, д. 11","ул. Кирова, д. 12","ул. Кирова, д. 14","ул. Кирова, д. 16","ул. Кирова, д. 18","ул. Парковая, д. 1","ул. Парковая, д. 2","ул. Парковая, д. 3","ул. Парковая, д. 4","ул. Парковая, д. 5","ул. Парковая, д. 6","ул. Парковая, д. 7","ул. Парковая, д. 8","ул. Парковая, д. 9","ул. Парковая, д. 10","ул. Парковая, д. 11","ул. Парковая, д. 12","ул. Парковая, д. 13","ул. Парковая, д. 14","ул. Парковая, д. 15"]
    },
    {
      "id": 2, "name": "ЖКС №2 Самраского района", "address": "ул. Самарская, д. 25", "phone": "+380-222-31-12",
      "head": "Петров Пётр Петрович", "headSchedule": "Ср, Пт 14:00–16:00",
      "streets": ["ул. Самарская", "ул. Степная"],
      "homes": ["ул. Самарская, д. 1","ул. Самарская, д. 2","ул. Самарская, д. 3","ул. Самарская, д. 4","ул. Самарская, д. 5","ул. Самарская, д. 6","ул. Самарская, д. 7","ул. Самарская, д. 8","ул. Самарская, д. 9","ул. Самарская, д. 10","ул. Самарская, д. 11","ул. Самарская, д. 12","ул. Самарская, д. 13","ул. Самарская, д. 14","ул. Самарская, д. 15","ул. Степная, д. 1","ул. Степная, д. 2","ул. Степная, д. 3","ул. Степная, д. 4","ул. Степная, д. 5","ул. Степная, д. 6","ул. Степная, д. 7","ул. Степная, д. 8","ул. Степная, д. 9","ул. Степная, д. 10","ул. Степная, д. 11","ул. Степная, д. 12"]
    },
    {
      "id": 3, "name": "ЖКС №3 Днепровского района", "address": "ул. Днепровская, д. 50", "phone": "+380-222-31-13",
      "head": "Сидоров Алексей Николаевич", "headSchedule": "Пн, Ср 10:00–12:00",
      "streets": ["ул. Днепровская", "ул. Речная"],
      "homes": ["ул. Днепровская, д. 1","ул. Днепровская, д. 2","ул. Днепровская, д. 3","ул. Днепровская, д. 4","ул. Днепровская, д. 5","ул. Днепровская, д. 6","ул. Днепровская, д. 7","ул. Днепровская, д. 8","ул. Днепровская, д. 9","ул. Днепровская, д. 10","ул. Днепровская, д. 11","ул. Днепровская, д. 12","ул. Днепровская, д. 13","ул. Днепровская, д. 14","ул. Днепровская, д. 15","ул. Днепровская, д. 16","ул. Днепровская, д. 17","ул. Днепровская, д. 18","ул. Днепровская, д. 19","ул. Днепровская, д. 20","ул. Речная, д. 5","ул. Речная, д. 7","ул. Речная, д. 9","ул. Речная, д. 11","ул. Речная, д. 13","ул. Речная, д. 15"]
    },
    {
      "id": 4, "name": "ЖКС №4 Ярославского района", "address": "ул. Ярославская, д. 8", "phone": "+380-222-31-14",
      "head": "Кузнецов Дмитрий Сергеевич", "headSchedule": "Вт, Чт 9:00–11:00",
      "streets": ["ул. Ярославская", "ул. Северная"],
      "homes": ["ул. Ярославская, д. 1","ул. Ярославская, д. 2","ул. Ярославская, д. 3","ул. Ярославская, д. 4","ул. Ярославская, д. 5","ул. Ярославская, д. 6","ул. Ярославская, д. 7","ул. Ярославская, д. 8","ул. Ярославская, д. 9","ул. Ярославская, д. 10","ул. Ярославская, д. 11","ул. Ярославская, д. 12","ул. Северная, д. 1","ул. Северная, д. 2","ул. Северная, д. 3","ул. Северная, д. 4","ул. Северная, д. 5","ул. Северная, д. 6","ул. Северная, д. 7","ул. Северная, д. 8","ул. Северная, д. 9","ул. Северная, д. 10"]
    }
  ],
  "news": [
    {
      "id": 1, "date": "2026-06-30", "title": "Плановое отключение горячей воды",
      "short": "В связи с профилактическими работами на теплосетях с 1 по 14 июля будет отключено горячее водоснабжение в Кировском и Самраском районах.",
      "full": "Уважаемые жители! Сообщаем, что в период с 1 по 14 июля 2026 года будет произведено плановое отключение горячего водоснабжения в Кировском и Самраском районах. Отключение связано с ежегодными профилактическими работами на тепловых сетях и котельных. Приносим извинения за временные неудобства. По всем вопросам обращайтесь в диспетчерскую службу по телефону +380-222-31-27.",
      "district": "Кировский",
      "urgent": true
    },
    {
      "id": 2, "date": "2026-06-28", "title": "Новый тариф на вывоз ТКО с 1 июля",
      "short": "С 1 июля 2026 года вступают в силу новые тарифы на вывоз твёрдых коммунальных отходов.",
      "full": "С 1 июля 2026 года изменяются тарифы на услугу по обращению с твёрдыми коммунальными отходами. Новый тариф составит 56,11 ZD с человека в месяц. Перерасчёт будет произведён автоматически. С подробной информацией можно ознакомиться в разделе «Тарифы» на нашем сайте или в офисе ЖКС по адресу ул. Центральная, д. 1.",
      "district": "Все",
      "urgent": false
    },
    {
      "id": 3, "date": "2026-06-25", "title": "Благоустройство дворовых территорий",
      "short": "В рамках программы «Комфортная городская среда» в 2026 году будут благоустроены 5 дворовых территорий.",
      "full": "Администрация города Загребенки совместно с ЖКС продолжает реализацию программы «Комфортная городская среда». В 2026 году запланировано благоустройство следующих дворовых территорий: ул. Кирова, д. 1–5, ул. Самарская, д. 3–7, ул. Днепровская, д. 10–14, ул. Парковая, д. 20–25, ул. Степная, д. 5–9. В рамках работ будут установлены новые скамейки, урны, детские площадки, проведено озеленение. Срок завершения работ — октябрь 2026 года.",
      "district": "Все",
      "urgent": false
    },
    {
      "id": 4, "date": "2026-06-20", "title": "Субботник в Днепровском районе",
      "short": "Приглашаем жителей Днепровского района принять участие в субботнике 27 июня.",
      "full": "Уважаемые жители! В субботу 27 июня 2026 года в 10:00 состоится общегородской субботник в Днепровском районе. Сбор у дома № 10 по улице Днепровской. Приглашаем всех желающих! Инвентарь (грабли, мётлы, мешки) будет предоставлен ЖКС.",
      "district": "Днепровский",
      "urgent": false
    },
    {
      "id": 5, "date": "2026-06-15", "title": "Проверка газового оборудования",
      "short": "С 1 по 15 июля специалисты проведут плановую проверку газового оборудования в Ярославском районе.",
      "full": "Уважаемые жители Ярославского района! С 1 по 15 июля 2026 года сотрудники газовой службы проведут плановую проверку внутридомового и внутриквартирного газового оборудования. Просим обеспечить доступ в квартиры. График можно уточнить в ЖКС №4.",
      "district": "Ярославский",
      "urgent": false
    }
  ],
  "outages": [
    {"district": "ЖКС №1 Кировского района","date": "2026-07-01","time": "09:00–17:00","type": "электричество","addresses": "ул. Кирова, д. 1–10"},
    {"district": "ЖКС №2 Самраского района","date": "2026-07-02","time": "10:00–16:00","type": "вода","addresses": "ул. Самарская, д. 1–8"},
    {"district": "ЖКС №3 Днепровского района","date": "2026-07-03","time": "09:00–15:00","type": "газ","addresses": "ул. Днепровская, д. 1–10"},
    {"district": "ЖКС №4 Ярославского района","date": "2026-07-04","time": "13:00–18:00","type": "электричество","addresses": "ул. Ярославская, д. 1–12"},
    {"district": "ЖКС №1 Кировского района","date": "2026-07-05","time": "10:00–14:00","type": "вода","addresses": "ул. Парковая, д. 1–10"},
    {"district": "ЖКС №3 Днепровского района","date": "2026-07-06","time": "09:00–17:00","type": "электричество","addresses": "ул. Речная, д. 5–15"}
  ],
  "houseRegistry": [
    {"address": "ул. Кирова, д. 1","year": 1985,"floors": 5,"apartments": 60,"area": 3200,"districtId": 1,"managementStart": "2010"},
    {"address": "ул. Кирова, д. 5","year": 1990,"floors": 9,"apartments": 108,"area": 5800,"districtId": 1,"managementStart": "2010"},
    {"address": "ул. Самарская, д. 10","year": 2005,"floors": 10,"apartments": 120,"area": 7200,"districtId": 2,"managementStart": "2012"},
    {"address": "ул. Днепровская, д. 15","year": 1978,"floors": 5,"apartments": 70,"area": 3800,"districtId": 3,"managementStart": "2011"},
    {"address": "ул. Ярославская, д. 3","year": 2000,"floors": 12,"apartments": 144,"area": 8500,"districtId": 4,"managementStart": "2015"}
  ],
  "events": [
    {"id": 1, "date": "2026-07-15", "title": "Встреча с жителями Кировского района", "description": "Открытая встреча с руководством ЖКС №1. Вопросы содержания домов и благоустройства.", "location": "ул. Кирова, д. 10, актовый зал", "time": "17:00", "district": "Кировский"},
    {"id": 2, "date": "2026-07-20", "title": "Прямая линия с главным инженером", "description": "Звонки от жителей по вопросам отопления, водоснабжения и текущего ремонта.", "location": "по телефону +380-222-31-03", "time": "15:00–17:00", "district": "Все"},
    {"id": 3, "date": "2026-07-25", "title": "День открытых дверей в ЖКС", "description": "Приём жителей по личным вопросам руководством службы. Предварительная запись не требуется.", "location": "ул. Центральная, д. 1", "time": "10:00–16:00", "district": "Все"},
    {"id": 4, "date": "2026-08-01", "title": "Собрание старших по домам", "description": "План работ на август, отчёты по текущим ремонтам, обсуждение благоустройства.", "location": "ул. Самарская, д. 25, конференц-зал", "time": "16:00", "district": "Самарский"}
  ],
  "partners": [
    {"name": "ООО «ТеплоЭнерго»", "description": "Поставщик тепловой энергии. Обслуживание тепловых сетей и котельных.", "phone": "+380-222-31-40", "website": ""},
    {"name": "МУП «Водоканал Загребенки»", "description": "Водоснабжение и водоотведение. Холодная и горячая вода.", "phone": "+380-222-31-41", "website": ""},
    {"name": "АО «ЗагребенкиГаз»", "description": "Поставка природного газа, обслуживание газового оборудования.", "phone": "+380-222-31-42", "website": ""},
    {"name": "ООО «ЭлектроСети Плюс»", "description": "Передача и распределение электроэнергии.", "phone": "+380-222-31-43", "website": ""},
    {"name": "УК «КомфортСервис»", "description": "Уборка придомовых территорий, вывоз ТКО, содержание контейнерных площадок.", "phone": "+380-222-31-44", "website": ""},
    {"name": "ООО «ЛифтРемонт»", "description": "Обслуживание и ремонт лифтового оборудования.", "phone": "+380-222-31-45", "website": ""}
  ],
  "guides": [
    {"id": 1, "title": "Как передать показания счётчиков", "icon": "fas fa-tachometer-alt", "steps": ["Зайдите в личный кабинет или откройте форму передачи показаний на главной странице.", "Введите номер лицевого счёта и адрес.", "Укажите показания холодной, горячей воды и электричества.", "Нажмите «Отправить». Показания будут приняты в обработку."], "note": "Показания принимаются ежемесячно до 25 числа."},
    {"id": 2, "title": "Как оплатить коммунальные услуги", "icon": "fas fa-credit-card", "steps": ["Зайдите в личный кабинет и нажмите «Оплатить».", "Выберите способ оплаты: АТБ Банк или ФПИ PAY.", "На странице банка заполните реквизиты карты или телефона.", "Подтвердите платёж. Квитанция будет доступна для скачивания в личном кабинете."], "note": "Комиссия за перевод не взимается."},
    {"id": 3, "title": "Как подать заявку на ремонт", "icon": "fas fa-tools", "steps": ["Нажмите кнопку «Аварийная заявка» в шапке сайта.", "Заполните форму: ФИО, адрес, телефон, категория и описание проблемы.", "При необходимости прикрепите фото.", "Нажмите «Отправить». Номер заявки придёт на телефон."], "note": "Аварийные заявки обрабатываются круглосуточно."},
    {"id": 4, "title": "Как получить справку в ЖКС", "icon": "fas fa-file-alt", "steps": ["Обратитесь в отдел по работе с населением (ул. Центральная, д. 1, каб. 12).", "Имейте при себе паспорт и документы на квартиру.", "Напишите заявление на имя руководителя.", "Срок изготовления справки — до 3 рабочих дней."], "note": "Госпошлина не взимается."}
  ],
  "polls": [
    {"id": 1, "question": "Какие дворовые работы нужно провести в первую очередь?", "options": ["Ремонт детских площадок", "Установка новых скамеек", "Освещение дворов", "Озеленение"], "votes": [45, 30, 60, 22], "active": true, "date": "2026-06-25"},
    {"id": 2, "question": "Какой формат собраний жильцов вам удобнее?", "options": ["Очно в ЖКС", "Онлайн-трансляция", "Заочное голосование", "Чат в мессенджере"], "votes": [15, 42, 28, 35], "active": true, "date": "2026-06-20"},
    {"id": 3, "question": "Нужен ли в городе дополнительный пункт приёма вторсырья?", "options": ["Да, очень нужно", "Скорее да", "Скорее нет", "Нет, не нужно"], "votes": [78, 45, 12, 8], "active": false, "date": "2026-06-10"}
  ]
};

function loadData() {
  if (appData) return Promise.resolve(appData);
  return fetch(DATA_URL).then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }).then(data => {
    appData = data;
    return data;
  }).catch(() => {
    appData = EMBEDDED_DATA;
    return EMBEDDED_DATA;
  });
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const months = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function normalizeStr(str) {
  return str.replace(/\s+/g, ' ').trim().toLowerCase();
}

function searchAddress(query) {
  if (!appData || !query.trim()) return [];
  const q = normalizeStr(query);
  const results = [];
  for (const dist of appData.districts) {
    for (const home of dist.homes) {
      if (normalizeStr(home).includes(q)) {
        results.push({ home, district: dist });
      }
    }
  }
  return results;
}

function openModal(htmlContent, title, large) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay active';
  overlay.innerHTML = `
    <div class="modal ${large ? 'modal--large' : ''}">
      <button class="modal__close" aria-label="Закрыть">&times;</button>
      ${title ? `<h3 class="modal__title">${title}</h3>` : ''}
      <div class="modal__body">${htmlContent}</div>
    </div>
  `;
  document.body.appendChild(overlay);
  const close = () => overlay.remove();
  overlay.querySelector('.modal__close').addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', function handler(e) {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', handler); }
  });
  return overlay;
}

function showDistrictDetail(district) {
  const homesHtml = district.homes.map(h => `<span>${h}</span>`).join('');
  const html = `
    <div class="modal__info-row"><strong>Адрес участка:</strong> ${district.address}</div>
    <div class="modal__info-row"><strong>Телефон диспетчера:</strong> ${district.phone}</div>
    <div class="modal__info-row"><strong>Начальник участка:</strong> ${district.head}</div>
    <div class="modal__info-row"><strong>График приёма:</strong> ${district.headSchedule}</div>
    <div class="modal__info-row" style="margin-top:16px;"><strong>Обслуживаемые дома:</strong></div>
    <div class="modal__homes-list">${homesHtml}</div>
  `;
  openModal(html, district.name, true);
}

function showNewsDetail(newsItem) {
  const html = `
    <div class="modal__text">
      <p style="color:var(--color-text-muted);font-size:0.8rem;margin-bottom:16px;">${formatDate(newsItem.date)}</p>
      ${newsItem.full.split('\n').map(p => `<p>${p}</p>`).join('')}
    </div>
  `;
  openModal(html, newsItem.title);
}

function showMeterForm() {
  const html = `
    <form class="meter-form">
      <div class="form__group">
        <label class="form__label" for="meter-name">ФИО</label>
        <input class="form__input" id="meter-name" type="text" required placeholder="Иванов Иван Иванович">
      </div>
      <div class="form__group">
        <label class="form__label" for="meter-account">Лицевой счёт</label>
        <input class="form__input" id="meter-account" type="text" required placeholder="1234567890">
      </div>
      <div class="form__group">
        <label class="form__label" for="meter-address">Адрес</label>
        <input class="form__input" id="meter-address" type="text" required placeholder="ул. Кирова, д. 5, кв. 10">
      </div>
      <div class="form__group">
        <label class="form__label" for="meter-el">Электричество, кВт·ч</label>
        <input class="form__input" id="meter-el" type="number" step="0.01" required>
      </div>
      <div class="form__group">
        <label class="form__label" for="meter-water-cold">Холодная вода, м³</label>
        <input class="form__input" id="meter-water-cold" type="number" step="0.01" required>
      </div>
      <div class="form__group">
        <label class="form__label" for="meter-water-hot">Горячая вода, м³</label>
        <input class="form__input" id="meter-water-hot" type="number" step="0.01" required>
      </div>
      <button type="submit" class="btn btn--primary form__submit">Отправить показания</button>
    </form>
    <div class="form__success">
      <i class="fas fa-check-circle"></i>
      <h3>Показания отправлены</h3>
      <p>Спасибо! Ваши показания приняты.</p>
    </div>
  `;
  const overlay = openModal(html, 'Передать показания');
  const form = overlay.querySelector('.meter-form');
  const success = overlay.querySelector('.form__success');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.style.display = 'none';
    success.classList.add('active');
  });
}

function showRepairForm() {
  const html = `
    <form class="repair-form">
      <div class="form__group">
        <label class="form__label" for="repair-name">ФИО</label>
        <input class="form__input" id="repair-name" type="text" required placeholder="Иванов Иван Иванович">
      </div>
      <div class="form__group">
        <label class="form__label" for="repair-address">Адрес</label>
        <input class="form__input" id="repair-address" type="text" required placeholder="ул. Кирова, д. 5, кв. 10">
      </div>
      <div class="form__group">
        <label class="form__label" for="repair-phone">Телефон</label>
        <input class="form__input" id="repair-phone" type="tel" required placeholder="+7 (123) 456-78-90">
      </div>
      <div class="form__group">
        <label class="form__label" for="repair-category">Категория</label>
        <select class="form__select" id="repair-category" required>
          <option value="">Выберите категорию</option>
          <option value="santechnika">Сантехника</option>
          <option value="elektrika">Электрика</option>
          <option value="krovlya">Кровля</option>
          <option value="musor">Мусор</option>
          <option value="other">Другое</option>
        </select>
      </div>
      <div class="form__group">
        <label class="form__label" for="repair-text">Описание проблемы</label>
        <textarea class="form__textarea" id="repair-text" required placeholder="Опишите проблему подробно..."></textarea>
      </div>
      <div class="form__group">
        <label class="form__label" for="repair-file">Прикрепить файл (необязательно)</label>
        <input class="form__input" id="repair-file" type="file">
      </div>
      <button type="submit" class="btn btn--primary form__submit">Отправить заявку</button>
    </form>
    <div class="form__success">
      <i class="fas fa-check-circle"></i>
      <h3>Заявка принята</h3>
      <p>Спасибо! Ваша заявка на ремонт отправлена. Мы свяжемся с вами.</p>
    </div>
  `;
  const overlay = openModal(html, 'Заявка на ремонт');
  const form = overlay.querySelector('.repair-form');
  const success = overlay.querySelector('.form__success');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.style.display = 'none';
    success.classList.add('active');
  });
}

function renderOutageType(type) {
  let cls = 'outages__type';
  if (type.includes('вод')) cls += ' outages__type--water';
  else if (type.includes('электр')) cls += ' outages__type--electricity';
  else if (type.includes('газ')) cls += ' outages__type--gas';
  return `<span class="${cls}">${type}</span>`;
}

function renderSearchResults(results, container) {
  container.innerHTML = '';
  if (results.length === 0) {
    container.innerHTML = `<div class="hero__search-result-item">
      <div class="result-no-match">Дом не обслуживается нашей службой.<br>Обратитесь в районную администрацию.</div>
    </div>`;
    container.classList.add('active');
    return;
  }
  for (const r of results.slice(0, 10)) {
    const el = document.createElement('div');
    el.className = 'hero__search-result-item';
    el.innerHTML = `
      <div class="result-address">${r.home}</div>
      <div class="result-district">${r.district.name}</div>
      <div class="result-phone">${r.district.phone}</div>
    `;
    el.addEventListener('click', () => {
      showDistrictDetail(r.district);
      container.classList.remove('active');
    });
    container.appendChild(el);
  }
  container.classList.add('active');
}

// ===== Accessibility =====
function toggleAccessPanel() {
  const panel = document.getElementById('accessPanel');
  if (panel) panel.classList.toggle('active');
}

function setHighContrast(enabled) {
  document.body.classList.toggle('high-contrast', enabled);
  try { localStorage.setItem('zhks_contrast', enabled ? '1' : '0'); } catch(e) {}
}

function setLargeFont(enabled) {
  document.body.classList.toggle('large-font', enabled);
  try { localStorage.setItem('zhks_largefont', enabled ? '1' : '0'); } catch(e) {}
}

function initAccessibility() {
  try {
    if (localStorage.getItem('zhks_contrast') === '1') setHighContrast(true);
    if (localStorage.getItem('zhks_largefont') === '1') setLargeFont(true);
  } catch(e) {}
}

// ===== Captcha =====
let _captchaAnswer = 0;

function generateCaptcha() {
  const a = Math.floor(Math.random() * 10) + 3;
  const b = Math.floor(Math.random() * 10) + 1;
  _captchaAnswer = a + b;
  const el = document.getElementById('captchaQuestion');
  if (el) el.textContent = a + ' + ' + b + ' = ?';
}

function validateCaptcha() {
  const input = document.getElementById('captchaInput');
  if (!input) return true;
  const val = parseInt(input.value);
  if (isNaN(val) || val !== _captchaAnswer) {
    input.style.borderColor = 'var(--color-danger)';
    return false;
  }
  input.style.borderColor = '';
  return true;
}

// ===== PDF receipt =====
function downloadReceipt(payment) {
  var p = getProfile();
  if (!p) return;
  var addr = p.user.address;
  var name = p.user.name;
  var W = 595, H = 842;
  var canvas = document.createElement('canvas');
  canvas.width = W * 2; canvas.height = H * 2;
  var ctx = canvas.getContext('2d');
  ctx.scale(2, 2);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#1A3B5C';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, W - 40, H - 40);
  ctx.font = 'bold 18px Unbounded, sans-serif';
  ctx.fillStyle = '#1A3B5C';
  ctx.textAlign = 'center';
  ctx.fillText('ЖКС Загребенки', W / 2, 60);
  ctx.font = '12px Inter, sans-serif';
  ctx.fillStyle = '#4A4A4A';
  ctx.fillText('КВИТАНЦИЯ ОБ ОПЛАТЕ № ' + (payment.id || Date.now().toString(36).toUpperCase()), W / 2, 85);
  ctx.font = '10px Inter, sans-serif';
  ctx.textAlign = 'left';
  var y = 120;
  var drawRow = function(label, value) {
    ctx.fillStyle = '#1E1E1E';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText(label + ':', 50, y);
    ctx.fillStyle = '#4A4A4A';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText(value || '—', 200, y);
    y += 20;
  };
  drawRow('Плательщик', name);
  drawRow('Адрес', addr);
  drawRow('Период', payment.period || '—');
  drawRow('Начислено', (payment.total || 0).toLocaleString('ru-RU', {minimumFractionDigits:2}) + ' ZD');
  drawRow('Оплачено', (payment.paid || payment.total || 0).toLocaleString('ru-RU', {minimumFractionDigits:2}) + ' ZD');
  drawRow('Дата оплаты', payment.date || new Date().toLocaleDateString('ru-RU'));
  y += 20;
  ctx.strokeStyle = '#E2E6EE';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(50, y); ctx.lineTo(W - 50, y);
  ctx.stroke();
  y += 20;
  ctx.fillStyle = '#1E1E1E';
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.fillText('Детализация:', 50, y);
  y += 22;
  var details = [
    { label: 'Содержание жилья', value: payment.maintenance },
    { label: 'Текущий ремонт', value: payment.repair },
    { label: 'Водоснабжение', value: payment.water },
    { label: 'Отопление', value: payment.heating },
    { label: 'Электроэнергия', value: payment.electricity }
  ];
  for (var i = 0; i < details.length; i++) {
    ctx.fillStyle = '#4A4A4A';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText(details[i].label, 60, y);
    ctx.textAlign = 'right';
    ctx.fillText((details[i].value || 0).toLocaleString('ru-RU', {minimumFractionDigits:2}) + ' ZD', W - 60, y);
    ctx.textAlign = 'left';
    y += 18;
  }
  y += 20;
  ctx.font = '9px Inter, sans-serif';
  ctx.fillStyle = '#8A8A8A';
  ctx.textAlign = 'center';
  ctx.fillText('Данный чек сформирован автоматически и не имеет юридической силы.', W / 2, y);
  y += 14;
  ctx.fillText('ЖКС Загребенки • ' + new Date().toLocaleDateString('ru-RU'), W / 2, y);
  var link = document.createElement('a');
  link.download = 'receipt_' + Date.now() + '.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// ===== Newsletter =====
function subscribeNewsletter(e) {
  if (e) e.preventDefault();
  var input = document.getElementById('newsletterEmail');
  if (!input || !input.value.trim()) return;
  if (!validateCaptcha()) { alert('Решите капчу'); return; }
  var consent = document.getElementById('newsletterConsent');
  if (consent && !consent.checked) { alert('Примите согласие на обработку данных'); return; }
  var btn = e ? e.target.querySelector('button') : null;
  if (btn) { btn.disabled = true; btn.textContent = 'Подписка...'; }
  setTimeout(function() {
    var msg = document.getElementById('newsletterMsg');
    if (msg) { msg.textContent = 'Вы подписались на новости!'; msg.style.color = 'var(--color-success)'; }
    if (input) input.value = '';
    if (btn) { btn.disabled = false; btn.textContent = 'Подписаться'; }
    generateCaptcha();
  }, 800);
}

// ===== Side menu =====
function openSideMenu() {
  var overlay = document.getElementById('sideMenuOverlay');
  var menu = document.getElementById('sideMenu');
  if (overlay) overlay.classList.add('active');
  if (menu) menu.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSideMenu() {
  var overlay = document.getElementById('sideMenuOverlay');
  var menu = document.getElementById('sideMenu');
  if (overlay) overlay.classList.remove('active');
  if (menu) menu.classList.remove('open');
  document.body.style.overflow = '';
}

function buildSideMenu() {
  var overlay = document.getElementById('sideMenuOverlay');
  var menu = document.getElementById('sideMenu');
  if (!menu) return;
  var profile = getProfile();
  var isAuth = isAuthenticated();
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  var links = [
    { href: 'index.html', icon: 'fa-home', label: 'Главная' },
    { href: 'about.html', icon: 'fa-building', label: 'О нас' },
    { href: 'news.html', icon: 'fa-newspaper', label: 'Новости' },
    { href: 'districts.html', icon: 'fa-map-marked-alt', label: 'Участки' },
    { href: 'services.html', icon: 'fa-concierge-bell', label: 'Услуги' },
    { href: 'outages.html', icon: 'fa-calendar-times', label: 'Отключения' },
    { href: 'calendar.html', icon: 'fa-calendar-alt', label: 'События' },
    { href: 'guides.html', icon: 'fa-book', label: 'Памятки' },
    { href: 'partners.html', icon: 'fa-handshake', label: 'Партнёры' },
    { href: 'polls.html', icon: 'fa-poll', label: 'Голосования' }
  ];
  var moreLinks = [
    { href: 'documents.html', icon: 'fa-folder', label: 'Документы' },
    { href: 'repairs.html', icon: 'fa-hard-hat', label: 'Ремонты' },
    { href: 'gallery.html', icon: 'fa-images', label: 'Галерея' },
    { href: 'faq.html', icon: 'fa-question-circle', label: 'Вопросы-ответы' },
    { href: 'vacancies.html', icon: 'fa-briefcase', label: 'Вакансии' },
    { href: 'feedback.html', icon: 'fa-comment', label: 'Обратная связь' },
    { href: 'house-registry.html', icon: 'fa-building', label: 'Реестр домов' },
    { href: 'contacts.html', icon: 'fa-address-book', label: 'Контакты' }
  ];
  var html = '<div class="side-menu__header"><span class="side-menu__logo">ЖКС Загребенки</span><button class="side-menu__close" onclick="closeSideMenu()" aria-label="Закрыть">&times;</button></div>';
  if (isAuth) {
    var p = profile;
    html += '<div class="side-menu__nav"><a href="profile.html" class="side-menu__link' + (currentPath === 'profile.html' ? ' side-menu__link--active' : '') + '"><i class="fas fa-user"></i> ' + (p ? p.user.name : 'Кабинет') + '</a></div>';
  } else {
    html += '<div class="side-menu__nav"><a href="#" class="side-menu__link" onclick="showLoginModal();return false;"><i class="fas fa-sign-in-alt"></i> Войти</a></div>';
  }
  html += '<div class="side-menu__nav">';
  for (var i = 0; i < links.length; i++) {
    var active = currentPath === links[i].href ? ' side-menu__link--active' : '';
    html += '<a href="' + links[i].href + '" class="side-menu__link' + active + '"><i class="fas ' + links[i].icon + '"></i> ' + links[i].label + '</a>';
  }
  html += '</div>';
  html += '<div class="side-menu__section">Информация</div><div class="side-menu__nav">';
  for (var j = 0; j < moreLinks.length; j++) {
    var act = currentPath === moreLinks[j].href ? ' side-menu__link--active' : '';
    html += '<a href="' + moreLinks[j].href + '" class="side-menu__link' + act + '"><i class="fas ' + moreLinks[j].icon + '"></i> ' + moreLinks[j].label + '</a>';
  }
  html += '</div>';
  menu.innerHTML = html;

  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeSideMenu();
    });
    document.addEventListener('keydown', function handler(e) {
      if (e.key === 'Escape') { closeSideMenu(); document.removeEventListener('keydown', handler); }
    });
  }
}

// ===== Autocomplete input =====
function setupAutocomplete(inputId, dataList, onSelect) {
  var input = document.getElementById(inputId);
  if (!input) return;
  var wrap = document.createElement('div');
  wrap.className = 'autocomplete-wrap';
  input.parentNode.insertBefore(wrap, input);
  wrap.appendChild(input);
  var dropdown = document.createElement('div');
  dropdown.className = 'autocomplete-dropdown';
  wrap.appendChild(dropdown);
  input.addEventListener('input', function() {
    var q = normalizeStr(this.value);
    if (!q) { dropdown.classList.remove('active'); dropdown.innerHTML = ''; return; }
    var matches = dataList.filter(function(item) { return normalizeStr(item).includes(q); }).slice(0, 8);
    dropdown.innerHTML = '';
    if (matches.length === 0) { dropdown.classList.remove('active'); return; }
    for (var i = 0; i < matches.length; i++) {
      var el = document.createElement('div');
      el.className = 'autocomplete-item';
      var idx = normalizeStr(matches[i]).indexOf(q);
      var display = matches[i];
      if (idx >= 0) {
        display = matches[i].slice(0, idx) + '<strong>' + matches[i].slice(idx, idx + q.length) + '</strong>' + matches[i].slice(idx + q.length);
      }
      el.innerHTML = display;
      el.addEventListener('click', function(val) {
        return function() {
          input.value = val;
          dropdown.classList.remove('active');
          if (onSelect) onSelect(val);
        };
      }(matches[i]));
      dropdown.appendChild(el);
    }
    dropdown.classList.add('active');
  });
  document.addEventListener('click', function(e) {
    if (!wrap.contains(e.target)) dropdown.classList.remove('active');
  });
  input.addEventListener('blur', function() {
    setTimeout(function() { dropdown.classList.remove('active'); }, 200);
  });
}

// ===== Poll helpers =====
function votePoll(pollId, optionIndex) {
  var data = appData || EMBEDDED_DATA;
  var poll = data.polls.find(function(p) { return p.id === pollId; });
  if (!poll || !poll.active) return;
  var voted = getVotedPolls();
  if (voted.indexOf(pollId) >= 0) { alert('Вы уже голосовали в этом опросе'); return; }
  poll.votes[optionIndex] = (poll.votes[optionIndex] || 0) + 1;
  voted.push(pollId);
  try { localStorage.setItem('zhks_voted', JSON.stringify(voted)); } catch(e) {}
  renderPollResults(pollId);
}

function getVotedPolls() {
  try { return JSON.parse(localStorage.getItem('zhks_voted')) || []; } catch(e) { return []; }
}

function renderPollResults(pollId) {
  var data = appData || EMBEDDED_DATA;
  var poll = data.polls.find(function(p) { return p.id === pollId; });
  if (!poll) return;
  var total = poll.votes.reduce(function(a, b) { return a + b; }, 0);
  var container = document.getElementById('pollResults' + pollId);
  if (!container) return;
  var form = document.getElementById('pollForm' + pollId);
  if (form) form.style.display = 'none';
  container.classList.add('active');
  var html = '';
  for (var i = 0; i < poll.options.length; i++) {
    var pct = total > 0 ? Math.round((poll.votes[i] / total) * 100) : 0;
    html += '<div style="margin-bottom:12px;"><div style="font-size:0.85rem;color:var(--color-text-secondary);margin-bottom:4px;">' + poll.options[i] + ' (' + pct + '%)</div><div class="poll-card__bar"><div class="poll-card__bar-fill" style="width:' + pct + '%;"></div></div><div class="poll-card__vote-count">' + poll.votes[i] + ' голосов</div></div>';
  }
  html += '<div style="font-size:0.78rem;color:var(--color-text-muted);">Всего голосов: ' + total + '</div>';
  container.innerHTML = html;
}

// ===== Calendar helpers =====
function renderCalendar(containerId, events, monthOffset) {
  var container = document.getElementById(containerId);
  if (!container) return;
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + (monthOffset || 0);
  if (month > 11) { month = 0; year++; }
  if (month < 0) { month = 11; year--; }
  var firstDay = new Date(year, month, 1).getDay();
  if (firstDay === 0) firstDay = 7;
  firstDay--;
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var today = now.getDate();
  var monthNames = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  var monthNamesShort = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
  var dayNames = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
  var html = '<div class="calendar__nav"><button class="calendar__nav-btn" onclick="renderCalendar(\'' + containerId + '\', events, ' + ((monthOffset||0) - 1) + ')"><i class="fas fa-chevron-left"></i></button><h3>' + monthNames[month] + ' ' + year + '</h3><button class="calendar__nav-btn" onclick="renderCalendar(\'' + containerId + '\', events, ' + ((monthOffset||0) + 1) + ')"><i class="fas fa-chevron-right"></i></button></div>';
  html += '<div class="calendar__grid">';
  for (var d = 0; d < 7; d++) html += '<div class="calendar__day-header">' + dayNames[d] + '</div>';
  var dateStr = function(y, m, d) { return y + '-' + ('0' + (m + 1)).slice(-2) + '-' + ('0' + d).slice(-2); };
  for (var i = 0; i < firstDay; i++) html += '<div class="calendar__day calendar__day--other"></div>';
  for (var day = 1; day <= daysInMonth; day++) {
    var cls = 'calendar__day';
    if (day === today && month === now.getMonth() && year === now.getFullYear() && !monthOffset) cls += ' calendar__day--today';
    var ds = dateStr(year, month, day);
    var hasEvent = events && events.some(function(e) { return e.date === ds; });
    if (hasEvent) cls += ' calendar__day--event';
    html += '<div class="' + cls + '" data-date="' + ds + '">' + day + '</div>';
  }
  html += '</div>';
  if (events && events.length > 0) {
    var monthEvents = events.filter(function(e) {
      var ed = new Date(e.date);
      return ed.getMonth() === month && ed.getFullYear() === year;
    }).sort(function(a, b) { return a.date.localeCompare(b.date); });
    if (monthEvents.length > 0) {
      html += '<div class="calendar__events">';
      for (var k = 0; k < monthEvents.length; k++) {
        var ev = monthEvents[k];
        var ed = new Date(ev.date);
        html += '<div class="calendar-event" onclick="showEventDetail(' + ev.id + ')"><div class="calendar-event__date"><div class="calendar-event__day">' + ed.getDate() + '</div><div class="calendar-event__month">' + monthNamesShort[ed.getMonth()] + '</div></div><div class="calendar-event__info"><h4>' + ev.title + '</h4><p>' + ev.description + '<br><small style="color:var(--color-text-muted)">' + (ev.time || '') + (ev.location ? ' • ' + ev.location : '') + '</small></p></div></div>';
      }
      html += '</div>';
    }
  }
  container.innerHTML = html;
  container.querySelectorAll('.calendar__day--event').forEach(function(el) {
    el.addEventListener('click', function() {
      var date = this.dataset.date;
      var dayEvents = events.filter(function(e) { return e.date === date; });
      if (dayEvents.length > 0) showEventDetail(dayEvents[0].id);
    });
  });
}

function showEventDetail(eventId) {
  var data = appData || EMBEDDED_DATA;
  var ev = data.events.find(function(e) { return e.id === eventId; });
  if (!ev) return;
  var html = '<div class="modal__info-row"><strong>Дата:</strong> ' + formatDate(ev.date) + '</div><div class="modal__info-row"><strong>Время:</strong> ' + (ev.time || '—') + '</div><div class="modal__info-row"><strong>Место:</strong> ' + (ev.location || '—') + '</div><div class="modal__info-row"><strong>Район:</strong> ' + (ev.district || '—') + '</div><div style="margin-top:16px;font-size:0.9rem;color:var(--color-text-secondary);line-height:1.6;">' + ev.description + '</div>';
  openModal(html, ev.title);
}

// ===== Auth & Profile =====
const AUTH_KEY = 'zhks_profile';

function isAuthenticated() {
  try { return localStorage.getItem(AUTH_KEY) !== null; } catch(e) { return false; }
}

function getProfile() {
  try {
    const d = localStorage.getItem(AUTH_KEY);
    return d ? JSON.parse(d) : null;
  } catch(e) { return null; }
}

function saveProfile(p) {
  try { localStorage.setItem(AUTH_KEY, JSON.stringify(p)); } catch(e) {}
}

function logout() {
  try { localStorage.removeItem(AUTH_KEY); } catch(e) {}
}

function showLoginModal() {
  const existing = document.querySelector('.modal-overlay.active');
  if (existing) return;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay active';
  overlay.innerHTML = `
    <div class="modal" style="max-width:420px;">
      <button class="modal__close" aria-label="Закрыть">&times;</button>
      <h3 class="modal__title">Вход в личный кабинет</h3>
      <div id="login-form-container">
        <form id="login-form">
          <div class="form__group">
            <label class="form__label">Введите любой ПИН-код для входа</label>
            <input class="form__input" id="login-pin" type="password" inputmode="numeric" maxlength="6" required placeholder="Введите ПИН-код" autocomplete="off">
          </div>
          <button type="submit" class="btn btn--primary form__submit">Войти</button>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  overlay.querySelector('.modal__close').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function handler(e) {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', handler); }
  });

  const form = overlay.querySelector('#login-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const pin = overlay.querySelector('#login-pin').value;
    if (!pin) return;
    let profile = getProfile();
    if (!profile) {
      profile = {
        pin: pin,
        user: { name: 'Иванов Иван Иванович', phone: '+380-222-31-XX', email: 'ivanov@example.com', address: 'ул. Кирова, д. 5, кв. 42', districtId: 1 },
        apartment: { area: 54.3, rooms: 2, registered: 3, account: '1234567890' },
        building: { year: 1990, floors: 9, apartments: 108, senior: 'Петрова Анна Сергеевна', nextCapitalRepair: '2028' },
        balance: -1847.32,
        payments: createMockPayments(),
        meters: { coldWater: { number: '38721', installed: '15.03.2019', nextCheck: '15.03.2027' }, hotWater: { number: '38722', installed: '15.03.2019', nextCheck: '15.03.2027' }, electricity: { number: '59341', installed: '20.11.2018', nextCheck: '20.11.2026' } },
        meterHistory: [
          { type: 'coldWater', value: 184.5, date: '25.05.2026' },
          { type: 'hotWater', value: 97.2, date: '25.05.2026' },
          { type: 'electricity', value: 8452, date: '25.05.2026' },
          { type: 'coldWater', value: 179.8, date: '25.04.2026' },
          { type: 'hotWater', value: 92.1, date: '25.04.2026' },
          { type: 'electricity', value: 8230, date: '25.04.2026' }
        ],
        requests: [
          { id: 1, category: 'Сантехника', desc: 'Течёт смеситель на кухне', status: 'in-progress', date: '20.06.2026', comment: 'Заявка передана мастеру' },
          { id: 2, category: 'Электрика', desc: 'Не работает розетка в комнате', status: 'done', date: '05.06.2026', comment: 'Неисправность устранена' }
        ]
      };
      saveProfile(profile);
    }
    close();
    updateAuthButton();
    if (window.location.pathname.includes('profile.html')) {
      window.location.reload();
    } else {
      window.location.href = 'profile.html';
    }
  });
}

function createMockPayments() {
  const now = new Date();
  const months = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
  const res = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const dateStr = d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
    res.push({
      period: months[d.getMonth()] + ' ' + d.getFullYear(),
      date: dateStr,
      maintenance: 785.20, repair: 253.80, water: 412.50, heating: 0, electricity: 290.40,
      total: 1741.90, paid: i === 0 ? null : 1741.90, status: i === 0 ? 'pending' : 'paid'
    });
  }
  return res;
}

function updateAuthButton() {
  const container = document.querySelector('.header__right');
  if (!container) return;
  const existing = container.querySelector('.header__auth-btn');
  if (existing) existing.remove();

  const btn = document.createElement('div');
  btn.className = 'header__auth-btn';

  if (isAuthenticated()) {
    const profile = getProfile();
    btn.innerHTML = `<a href="profile.html" class="btn btn--outline" style="font-size:0.78rem;padding:6px 12px;"><i class="fas fa-user"></i> ${profile ? profile.user.name.split(' ')[0] : 'Кабинет'}</a>`;
  } else {
    btn.innerHTML = `<button class="btn btn--outline" onclick="showLoginModal()" style="font-size:0.78rem;padding:6px 12px;"><i class="fas fa-sign-in-alt"></i> Войти</button>`;
  }

  const searchToggle = container.querySelector('.header__search-toggle');
  if (searchToggle) {
    container.insertBefore(btn, searchToggle);
  } else {
    container.appendChild(btn);
  }
}

// ===== Inject UI elements =====
function injectAccessPanel() {
  if (document.getElementById('accessPanel')) return;
  var header = document.querySelector('.header');
  if (!header) return;
  var panel = document.createElement('div');
  panel.id = 'accessPanel';
  panel.className = 'access-panel';
  panel.innerHTML = '<div class="container access-panel__inner"><span class="access-panel__label"><i class="fas fa-eye"></i> Версия для слабовидящих</span><button onclick="setHighContrast(true);this.style.borderColor=\'#66b0ff\'" onmouseout="this.style.borderColor=\'\'"><i class="fas fa-adjust"></i> Высокий контраст</button><button onclick="setHighContrast(false)">Обычный режим</button><button onclick="setLargeFont(true)"><i class="fas fa-font"></i> Крупный шрифт</button><button onclick="setLargeFont(false)">Обычный шрифт</button><button class="access-panel__close" onclick="toggleAccessPanel()" aria-label="Закрыть">&times;</button></div>';
  header.after(panel);
}

function injectSideMenu() {
  if (document.getElementById('sideMenuOverlay')) return;
  var overlay = document.createElement('div');
  overlay.id = 'sideMenuOverlay';
  overlay.className = 'side-menu-overlay';
  document.body.appendChild(overlay);
  var menu = document.createElement('div');
  menu.id = 'sideMenu';
  menu.className = 'side-menu';
  document.body.appendChild(menu);
}

document.addEventListener('DOMContentLoaded', () => {
  updateAuthButton();
  initAccessibility();
  injectAccessPanel();
  injectSideMenu();
  buildSideMenu();

  // Side menu burger toggle (replaces old mobile nav toggle)
  const burger = document.getElementById('burger-toggle');
  if (burger) {
    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      openSideMenu();
    });
  }

  const dropdownToggle = document.querySelector('.header__nav-dropdown-toggle');
  const dropdownMenu = document.querySelector('.header__nav-dropdown-menu');
  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('open');
    });
    document.addEventListener('click', () => {
      dropdownMenu.classList.remove('open');
    });
  }

  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const tableWrapper = document.querySelector('.outages__table-wrapper');
  if (tableWrapper) {
    const checkScroll = () => {
      if (tableWrapper.scrollWidth > tableWrapper.clientWidth) {
        tableWrapper.classList.add('outages__table-wrapper--scrollable');
      }
    };
    checkScroll();
    window.addEventListener('resize', checkScroll);
  }

  // Newsletter form
  const nf = document.getElementById('newsletterForm');
  if (nf) nf.addEventListener('submit', subscribeNewsletter);

  // Page enter animation
  document.body.classList.add('page-enter');
});
