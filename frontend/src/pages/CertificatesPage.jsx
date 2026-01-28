import React, { useState, useEffect } from 'react';
import { Award, Download, ExternalLink, CheckCircle } from 'lucide-react';
import Layout from '../components/layout/Layout.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import { certificateService } from '../services/certificateService.js';

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await certificateService.getMyCertificates();
        setCertificates(response.certificates || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load certificates');
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  const handleDownload = async (certificateId, title) => {
    try {
      const blob = await certificateService.downloadCertificate(certificateId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}-certificate.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Failed to download certificate');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner text="Loading certificates..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="section-padding">
          <div className="container-app">
            <ErrorMessage message={error} onRetry={() => window.location.reload()} />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="section-padding">
        <div className="container-app">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              My <span className="gradient-text">Certificates</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Your achievements and completed courses
            </p>
          </div>

          {/* Content */}
          {certificates.length === 0 ? (
            <EmptyState
              icon={Award}
              title="No certificates yet"
              description="Complete courses and sessions to earn certificates"
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <div
                  key={cert._id}
                  className="card-elevated overflow-hidden group"
                >
                  {/* Certificate Preview */}
                  <div className="h-40 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Award className="w-16 h-16 text-primary/40 mx-auto mb-2" />
                        <div className="flex items-center justify-center gap-1 text-sm text-primary/60">
                          <CheckCircle className="w-4 h-4" />
                          <span>Verified</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-display font-semibold text-lg text-foreground line-clamp-2 mb-2">
                      {cert.skill?.title || cert.title || 'Certificate'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Issued on {formatDate(cert.issuedAt || cert.createdAt)}
                    </p>

                    {cert.code && (
                      <div className="mb-4 p-2 bg-secondary/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Certificate ID</p>
                        <p className="text-sm font-mono text-foreground">{cert.code}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownload(cert._id, cert.skill?.title || 'certificate')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      {cert.verifyUrl && (
                        <a
                          href={cert.verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CertificatesPage;
