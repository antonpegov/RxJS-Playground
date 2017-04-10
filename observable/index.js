const observer = {
    next: function (data){
        console.log(data);
    },
    error: function (err){
        console.log('Error:', err)
    },
    complete: function (){
        console.log('Done');
    }
} // Мой "наблюдатель"
const streamObservable = createObservable( obs => {
    let count = 0;
    let I = setInterval(()=>{
        count++;
        obs.next(count);
        if(count > 4){ 
            clearInterval(I);
            obs.complete();
        }
    },500)
}); // Синхронный источник
const arrayObservable = createObservable( obs => {
    [1,2,3,4,5].forEach(obs.next);
    obs.complete();
}); // Асинхронный источник

// Подписки: 
//streamObservable.subscribe(observer);
//arrayObservable.subscribe(observer);
streamObservable
    .map( x => x*10 )
    .subscribe(observer);
arrayObservable
    .map(x => x*2 )
    .subscribe(observer);
    
// Конструктор наблюдабельных объектов
function createObservable(subscrabeFn){
    return {
        map: mapFn,
        subscribe: subscrabeFn
    }
}
// Функция преобразования наблюдабельного объекта
function mapFn(transformationFn){
    const inputObservable = this; // Вызывающий ОБЗ
    const outputObservable = createObservable( obs => {
        // это функция, которая будет поставлять нам измененные данные,
        // для этого внутри создаем промежуточного наблюдателя, получающего данные от
        // ОБЗ-источника, преобразующего их и передающего конечному наблюдателю 
        inputObservable.subscribe({
            next: (x) => obs.next(transformationFn(x)), // трансформация и передача
            complete: () => obs.complete(), // передача без изменений
            error: (err) => obs.error(err)  // проброс ошибки
        });
    }); // Результирующий ОБЗ
    return outputObservable;
}

/* ========== Примеры функций =========== */

// Поток данных
function startReceivingDataFromStream(obs){
    let count = 0;
    let I = setInterval(()=>{
        count++;
        obs.next(count);
        if(count > 4){ 
            clearInterval(I);
            obs.complete();
        }
    },500)
}
// Ответ сервера
function startReceivingDataFromRequest(next){
    fetch('http://api.github.com').then(res=>res.json()).then(next);
}
// Простой массив
function startReceivingDataFromArray(next){
    [1,2,3,4,5].forEach(next);
}