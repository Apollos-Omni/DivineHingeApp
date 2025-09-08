import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { HingeEvent } from '../../types/types';
import { Card, CardContent } from '../components/card';

export const HingeControl = () => {
  const [events, setEvents] = useState<HingeEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHingeEvents() {
      const { data, error } = await supabase
        .from<HingeEvent>('hinge_events')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20);

      if (!error && data) setEvents(data);
      setLoading(false);
    }

    fetchHingeEvents();

    // Optional: real-time subscription
    const subscription = supabase
      .from('hinge_events')
      .on('INSERT', payload => setEvents(prev => [payload.new, ...prev]))
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);

  const handleAction = async (doorId: string, action: 'open' | 'close', status: 'locked' | 'unlocked') => {
    await supabase.from('hinge_events').insert([{ user_id: supabase.auth.getUser()?.data.user.id, door_id: doorId, action, status }]);
  };

  if (loading) return <p>Loading hinge data...</p>;

  return (
    <Card className="max-w-lg mx-auto mt-10">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Hinge Control</h2>
        <div className="flex gap-2 mb-4">
          <button onClick={() => handleAction('door_1', 'open', 'unlocked')} className="px-4 py-2 bg-green-500 text-white rounded">Open</button>
          <button onClick={() => handleAction('door_1', 'close', 'locked')} className="px-4 py-2 bg-red-500 text-white rounded">Close</button>
        </div>
        <h3 className="font-semibold mb-2">Recent Events:</h3>
        <ul>
          {events.map(ev => (
            <li key={ev.id}>{ev.door_id}: {ev.action} - {ev.status} @ {new Date(ev.timestamp).toLocaleTimeString()}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
