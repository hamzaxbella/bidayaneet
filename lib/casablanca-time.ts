const clock=new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Casablanca',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23',numberingSystem:'latn'});
function parts(instant:Date){return Object.fromEntries(clock.formatToParts(instant).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));}
export function casablancaDay(value:string){const p=parts(new Date(value));return `${p.year}-${p.month}-${p.day}`;}
export function casablancaInstant(date:string,time:string){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^\d{2}:\d{2}$/.test(time))throw Error('Vérifie la date et l’heure du rendez-vous.');
 const guess=new Date(`${date}T${time}:00Z`);if(!Number.isFinite(guess.getTime()))throw Error('Date invalide.');
 const p=parts(guess),wall=Date.UTC(Number(p.year),Number(p.month)-1,Number(p.day),Number(p.hour),Number(p.minute),Number(p.second)),instant=new Date(guess.getTime()-(wall-guess.getTime())),actual=parts(instant);
 if(`${actual.year}-${actual.month}-${actual.day}`!==date||`${actual.hour}:${actual.minute}`!==time)throw Error('Cette heure n’existe pas ce jour-là. Choisis une autre heure.');
 return instant.toISOString();
}
