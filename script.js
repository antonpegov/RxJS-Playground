$(() => {
    
    const $greenLed = $('#greenLed');
    const $redLed = $('#redLed');
    const $startBtn = $('#startBtn');
    const $stopBtn = $('#stopBtn');

    // ОБЗ генерирующее импульсы раз в пол секунды
    // share() говорит ОБЗ, что не нужно создавать новый источник 
    // при каждой подписке, а можно использовать существующий
    const interval$ = Rx.Observable.interval(500).share();

    // Стримы (ОБЗ) для нажатий на кнопки включения и выключения
    const startClicks$ = Rx.Observable.fromEvent($startBtn, 'click');
    const stopClicks$ = Rx.Observable.fromEvent($stopBtn, 'click');

    startClicks$.subscribe(()=>console.log('Start Clicked')); // тест стрима нажатий на Старт
    stopClicks$.subscribe(()=>console.log('Stop Clicked'));   // тест стрима нажатий на Стоп

    interval$
        .subscribe((c) => {
            $greenLed.toggleClass('on'); 
        });
    interval$
        .delay(200)
        .subscribe((c) => {
            $redLed.toggleClass('on'); 
        });
});