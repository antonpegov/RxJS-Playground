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
}
const streamObservable = {
    subscribe: function (obs){
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
} 
const arrayObservable = {
    subscribe: function (obs){
        [1,2,3,4,5].forEach(obs.next);
        obs.complete();
    }
}
streamObservable.subscribe(observer);
arrayObservable.subscribe(observer);


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