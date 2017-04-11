$(() => {
    
    const PERIOD = 3000; 
    const $greenLed = $('#greenLed');
    const $redLed = $('#redLed');
    const $startBtn = $('#startBtn');
    const $stopBtn = $('#stopBtn');
    const $search = $('#search');
    const $list = $('#list');

    // ОБЗ генерирующее импульсы раз в пол секунды
    // share() говорит ОБЗ, что не нужно создавать новый источник 
    // при каждой подписке, а можно использовать существующий
    const interval$ = Rx.Observable.interval(PERIOD).share();

    // Стримы (ОБЗ) для нажатий на кнопки включения и выключения
    const startClicks$ = Rx.Observable.fromEvent($startBtn, 'click');
    const stopClicks$ = Rx.Observable.fromEvent($stopBtn, 'click');

    // Стрим данных от поля ввода имени пользователя
    const input$ = Rx.Observable.fromEvent($search, 'input');

    // Обработка потока данных от поля ввода
    input$
        .map((e) => e.target.value)     // Достать из события значение инпута
        .filter((text) => text.length>2)// Отфильтровать короткие строки
        .debounceTime(300)              // Поставить задержку отправки данных
        .switchMap(getUsers)            // Заменить стрим с вводом на стрим с данными 
        .pluck('items')                 // Извлечь из объекта вложенный объект items
        .subscribe( (data) => {
            $list.html(data.map(d => 
                `<li><b>${d.login}</b> Url:<a target='_new' href='${d.html_url}'>${d.html_url}</a></li>`
            )) // Отрисовать список полученных имен
        });
    
    startClicks$.subscribe(()=>console.log('Start Clicked')); // тест стрима нажатий на Старт
    stopClicks$.subscribe(()=>console.log('Stop Clicked'));   // тест стрима нажатий на Стоп
    
    // Запуск и остановка мигания зеленого диода
    startClicks$
        .switchMap(()=>{
            return interval$.takeUntil(stopClicks$);
        })
        .subscribe((c) => {
            $greenLed.toggleClass('on'); 
        });  

    // Красный диод привязан к стриму intrval$ с задержкой в 20мс    
    interval$
        .delay(PERIOD/2)
        .subscribe((c) => {
            $redLed.toggleClass('on'); 
        });

    function getUsers(text){
        const response = fetch('https://api.github.com/search/users?q=' + text)
            .then(res => res.json());               // Промис, возвращаемый запросом
        return Rx.Observable.fromPromise(response)  // упаковывается в стрим (ОБЗ)
    }
});