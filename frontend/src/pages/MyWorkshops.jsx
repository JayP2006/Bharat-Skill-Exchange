import React, { useEffect, useState } from 'react';
import api from '@/utils/api';

const MyWorkshops = () => {
  const [workshops, setWorkshops] = useState([]);

  useEffect(() => {
    const fetchWorkshops = async () => {
      const res = await api.get('/workshops/my'); // only student's enrolled skills
      setWorkshops(res.data);
    };
    fetchWorkshops();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {workshops.map(ws => (
        <div key={ws._id} className="border p-4 rounded shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold">{ws.title}</h3>
          <p className="text-sm text-muted-foreground">{ws.skill.title}</p>
          <p className="text-sm">{new Date(ws.dateTime).toLocaleString()}</p>
          {ws.liveLink ? (
            <a href={ws.liveLink} target="_blank" className="mt-2 inline-block btn-primary">Join Live</a>
          ) : (
            <video src={ws.videoUrl} controls className="mt-2 w-full rounded" />
          )}
        </div>
      ))}
    </div>
  );
};

export default MyWorkshops;
