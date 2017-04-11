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

    startClicks$.subscribe(()=>console.log('Start Clicked')); // тест стрима нажатий на Старт
    stopClicks$.subscribe(()=>console.log('Stop Clicked'));   // тест стрима нажатий на Стоп
    input$.map((e)=>e.target.value).subscribe((data)=>console.log(data));   // тест Инпута

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
        return fetch('https://api.gihub.com/users' + text).then(res => res.json())
    }
});