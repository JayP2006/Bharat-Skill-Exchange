import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { bookingService } from '../services/bookingService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Calendar } from 'lucide-react';

const BookingsPage = () => {
  const { user } = useAuth();
  const isGuru = user?.role === 'Guru';

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Schedule modal
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [scheduleData, setScheduleData] = useState({
    date: '',
    time: '',
    durationInMinutes: 60,
  });

  // ✅ Status badge
  const getStatusBadge = (status) => {
    const base =
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold';

    const map = {
      REQUESTED: `${base} bg-yellow-100 text-yellow-700`,
      ACCEPTED: `${base} bg-blue-100 text-blue-700`,
      SCHEDULED: `${base} bg-emerald-100 text-emerald-700`,
      COMPLETED: `${base} bg-green-600 text-white`,
      CANCELLED: `${base} bg-red-100 text-red-700`,
    };

    return map[status] || map.REQUESTED;
  };

  const fetchBookings = async () => {
    try {
      const res = isGuru
        ? await bookingService.getBookingRequests()
        : await bookingService.getMyBookings();

      setBookings(res.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [isGuru]);

  // 🔥 Accept
  const handleAccept = async (bookingId) => {
    try {
      setActionLoading(true);
      await bookingService.acceptBooking(bookingId);
      fetchBookings();
    } catch (err) {
      console.error('Accept failed', err);
    } finally {
      setActionLoading(false);
    }
  };

  // 🔥 Reject
  const handleReject = async (bookingId) => {
    try {
      setActionLoading(true);
      await bookingService.rejectBooking(bookingId, 'Rejected by Guru');
      fetchBookings();
    } catch (err) {
      console.error('Reject failed', err);
    } finally {
      setActionLoading(false);
    }
  };

  // 🔥 Schedule
  const handleSchedule = async () => {
    const scheduledAt = `${scheduleData.date}T${scheduleData.time}`;

    try {
      setActionLoading(true);
      await bookingService.scheduleBooking(selectedBooking._id, {
        scheduledAt,
        durationInMinutes: scheduleData.durationInMinutes,
      });
      setShowModal(false);
      fetchBookings();
    } catch (err) {
      console.error('Schedule failed', err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner text="Loading bookings..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="section-padding">
        <div className="container-app max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">
            {isGuru ? 'Booking Requests' : 'My Bookings'}
          </h1>

          {bookings.length === 0 && (
            <p className="text-center text-muted-foreground">
              No bookings found
            </p>
          )}

          {bookings.map((b) => (
            <div
              key={b._id}
              className="card-elevated p-4 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              {/* LEFT */}
              <div>
                <p className="font-medium">{b.skill?.title}</p>
                <p className="text-sm text-muted-foreground">
                  {isGuru
                    ? `Learner: ${b.learner?.name}`
                    : `Guru: ${b.guru?.name}`}
                </p>

                {b.status === 'SCHEDULED' && (
                  <p className="text-sm mt-1 flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {new Date(b.scheduledAt).toLocaleString()}
                  </p>
                )}
              </div>

              {/* RIGHT */}
              <div className="flex flex-wrap items-center gap-2 justify-end">
                <span className={getStatusBadge(b.status)}>
                  {b.status}
                </span>

                {isGuru && b.status === 'REQUESTED' && (
                  <>
                    <button
                      disabled={actionLoading}
                      onClick={() => handleAccept(b._id)}
                      className="px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white"
                    >
                      Accept
                    </button>

                    <button
                      disabled={actionLoading}
                      onClick={() => handleReject(b._id)}
                      className="px-4 py-2 text-sm rounded-lg bg-red-100 text-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}

                {isGuru && b.status === 'ACCEPTED' && (
                  <button
                    onClick={() => {
                      setSelectedBooking(b);
                      setShowModal(true);
                    }}
                    className="btn-gradient px-4 py-2 text-sm rounded-lg"
                  >
                    Schedule
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 SCHEDULE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-background rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Schedule Session
            </h2>

            <div className="space-y-4">
              <input
                type="date"
                className="input-styled w-full"
                onChange={(e) =>
                  setScheduleData({ ...scheduleData, date: e.target.value })
                }
              />
              <input
                type="time"
                className="input-styled w-full"
                onChange={(e) =>
                  setScheduleData({ ...scheduleData, time: e.target.value })
                }
              />
              <input
                type="number"
                className="input-styled w-full"
                value={scheduleData.durationInMinutes}
                onChange={(e) =>
                  setScheduleData({
                    ...scheduleData,
                    durationInMinutes: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSchedule}
                className="btn-gradient px-4 py-2 rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default BookingsPage;
