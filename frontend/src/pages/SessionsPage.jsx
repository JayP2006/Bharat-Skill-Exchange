import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout.jsx';
import { sessionService } from '../services/sessionService.js';
import { useAuth } from '../context/AuthContext.jsx';

const SessionsPage = () => {
  const { user } = useAuth();
  const isGuru = user.role === 'Guru';
  const [sessions, setSessions] = useState([]);

  const fetchSessions = async () => {
    const res = await sessionService.getMySessions();
    setSessions(res.data.sessions);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const completeSession = async (id) => {
    await sessionService.completeSession(id);
    fetchSessions();
  };

  return (
    <Layout>
      <div className="container-app max-w-3xl section-padding">
        <h1 className="text-3xl font-bold mb-6">My Sessions</h1>

        {sessions.map((s) => (
          <div key={s._id} className="card-elevated p-5 mb-4 flex justify-between">
            <div>
              <p className="font-semibold">{s.skillName}</p>
              <p className="text-sm text-muted-foreground">
                With {isGuru ? s.sender.name : s.receiver.name}
              </p>

              {s.status === 'scheduled' && (
                <a
                  href={s.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-2 text-primary underline"
                >
                  Join Session
                </a>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="badge-primary">{s.status}</span>

              {isGuru && s.status === 'scheduled' && (
                <button
                  onClick={() => completeSession(s._id)}
                  className="btn-gradient px-4 py-2"
                >
                  Complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default SessionsPage;
