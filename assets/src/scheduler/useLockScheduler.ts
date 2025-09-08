import { useEffect } from 'react';
import { useScheduleState } from '../state/scheduleState';
import { useDeviceState } from '../state/deviceState';
import { useActivityState } from '../state/activityState';
function nowLocalHHMM(d=new Date()){ return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); }
export function useLockScheduler(){
  const { schedules, remove } = useScheduleState();
  const { setLock } = useDeviceState();
  const { add } = useActivityState();
  useEffect(()=>{
    const tick = ()=>{
      const cur = new Date(); const hhmm = nowLocalHHMM(cur);
      schedules.forEach(sc=>{
        if(!sc.enabled) return;
        if(sc.kind==='daily' && sc.time===hhmm){ setLock(sc.doorId, sc.action==='lock'); add({ type:'schedule', doorId: sc.doorId, ts: Date.now(), note: `${sc.action} @ ${hhmm}` }); }
        if(sc.kind==='once'){
          const t = new Date(sc.time);
          if(Math.abs(t.getTime()-cur.getTime()) < 30*1000){ setLock(sc.doorId, sc.action==='lock'); add({ type:'schedule', doorId: sc.doorId, ts: Date.now(), note: `${sc.action} once` }); remove(sc.id); }
        }
      });
    };
    tick();
    const id = setInterval(tick, 30*1000);
    return ()=> clearInterval(id);
  }, [schedules, setLock, add, remove]);
}
