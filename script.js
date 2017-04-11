$(() => {
    const $greenLed = $('#greenLed');
    const $redLed = $('#redLed');

    // Создаем ОБЗ, генерирующее импульсы раз в пол секунды
    // share() говорит ОБЗ, что не нужно создавать новый источник 
    // при каждой подписке, а можно использовать существующий
    const interval$ = Rx.Observable.interval(500).share();

    interval$.subscribe((c) => {
       $greenLed.toggleClass('on'); 
    });
    interval$.subscribe((c) => {
       $redLed.toggleClass('on'); 
    });
});