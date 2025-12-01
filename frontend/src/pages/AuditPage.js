import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import axios from 'axios';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Upload, FileText, Trash2, Play, CheckCircle, XCircle, Loader2, Eye, Download, Archive, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const AuditPage = () => {
  const { API, user } = useContext(AppContext);
  const [criteria, setCriteria] = useState([]);
  const [clauses, setClauses] = useState([]);
  const [selectedCriteria, setSelectedCriteria] = useState('');
  const [selectedClause, setSelectedClause] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [auditResult, setAuditResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetchCriteria();
  }, []);

  useEffect(() => {
    if (selectedCriteria) {
      fetchClauses(selectedCriteria);
    }
  }, [selectedCriteria]);

  useEffect(() => {
    if (selectedClause) {
      fetchDocuments(selectedClause.id);
      fetchAuditResult(selectedClause.id);
    }
  }, [selectedClause]);

  const fetchCriteria = async () => {
    try {
      const response = await axios.get(`${API}/criteria`);
      setCriteria(response.data);
    } catch (error) {
      toast.error('Gagal memuat kriteria');
    }
  };

  const fetchClauses = async (criteriaId) => {
    try {
      const response = await axios.get(`${API}/clauses?criteria_id=${criteriaId}`);
      setClauses(response.data);
      if (response.data.length > 0) {
        setSelectedClause(response.data[0]);
      }
    } catch (error) {
      toast.error('Gagal memuat klausul');
    }
  };

  const fetchDocuments = async (clauseId) => {
    try {
      const response = await axios.get(`${API}/clauses/${clauseId}/documents`);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const fetchAuditResult = async (clauseId) => {
    try {
      const response = await axios.get(`${API}/audit/results/${clauseId}`);
      setAuditResult(response.data);
    } catch (error) {
      setAuditResult(null);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedClause) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      await axios.post(`${API}/clauses/${selectedClause.id}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Dokumen berhasil diupload');
      fetchDocuments(selectedClause.id);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Gagal mengupload dokumen');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus dokumen ini? Jika tidak ada dokumen tersisa, hasil audit akan dihapus.')) {
      return;
    }
    
    try {
      const response = await axios.delete(`${API}/documents/${docId}`);
      
      if (response.data.audit_result_deleted) {
        toast.success('Dokumen dan hasil audit berhasil dihapus (tidak ada dokumen tersisa)');
        setAuditResult(null);
      } else {
        toast.success('Dokumen berhasil dihapus');
      }
      
      fetchDocuments(selectedClause.id);
    } catch (error) {
      toast.error('Gagal menghapus dokumen');
    }
  };

  const handlePreviewDocument = (doc) => {
    const previewUrl = `${API}/documents/${doc.id}/preview`;
    setPreviewDoc({ ...doc, previewUrl });
    setShowPreview(true);
  };

  const handleDownloadDocument = (docId, filename) => {
    const downloadUrl = `${API}/documents/${docId}/download`;
    window.open(downloadUrl, '_blank');
  };

  const handleDownloadAllDocuments = () => {
    if (!selectedClause) return;
    const downloadUrl = `${API}/clauses/${selectedClause.id}/documents/download-all`;
    window.open(downloadUrl, '_blank');
  };

  const isPdfOrImage = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    return ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext);
  };

  const handleHardReset = async () => {
    setResetting(true);
    try {
      const response = await axios.post(`${API}/audit/hard-reset`);
      const deleted = response.data.deleted;
      
      toast.success(
        `Hard reset berhasil! Dihapus: ${deleted.documents} dokumen, ${deleted.audit_results} hasil audit, ${deleted.recommendations} rekomendasi`
      );
      
      setShowResetDialog(false);
      setDocuments([]);
      setAuditResult(null);
      setSelectedClause(null);
      setSelectedCriteria('');
      
      // Refresh page after a moment
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Gagal melakukan hard reset');
    } finally {
      setResetting(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedClause) return;

    setAnalyzing(true);
    try {
      const response = await axios.post(`${API}/audit/analyze/${selectedClause.id}`);
      setAuditResult(response.data);
      toast.success('Analisis selesai!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Gagal menganalisis dokumen');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <Layout>
      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {previewDoc?.filename}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {previewDoc && (
              <div className="w-full h-full">
                {previewDoc.filename.toLowerCase().endsWith('.pdf') ? (
                  <iframe
                    src={previewDoc.previewUrl}
                    className="w-full h-full border-0"
                    title="Document Preview"
                  />
                ) : (
                  <img
                    src={previewDoc.previewUrl}
                    alt={previewDoc.filename}
                    className="max-w-full h-auto mx-auto"
                  />
                )}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => handleDownloadDocument(previewDoc?.id, previewDoc?.filename)}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hard Reset Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <RefreshCw className="w-5 h-5" />
              Konfirmasi Hard Reset
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 pt-2">
              <p className="font-semibold text-slate-900">
                ⚠️ PERINGATAN: Tindakan ini tidak dapat dibatalkan!
              </p>
              <div className="space-y-2 text-sm">
                <p>Hard reset akan menghapus:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-700 ml-2">
                  <li>Semua dokumen evidence yang telah diupload</li>
                  <li>Semua hasil penilaian AI</li>
                  <li>Semua skor dan status audit</li>
                  <li>Semua rekomendasi auditor</li>
                </ul>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800 font-medium">
                  💾 Sangat disarankan untuk <strong>backup evidence terlebih dahulu</strong> menggunakan tombol "Download Semua Evidence" di Dashboard sebelum melanjutkan.
                </p>
              </div>
              <p className="text-sm font-medium text-slate-900 pt-2">
                Apakah Anda yakin ingin melanjutkan?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={resetting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleHardReset}
              disabled={resetting}
              className="bg-red-600 hover:bg-red-700"
            >
              {resetting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Ya, Reset Semua
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-6" data-testid="audit-page">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Manrope, sans-serif', color: '#1a1a1a' }}>Audit Dokumen</h1>
            <p className="text-slate-600">Upload dokumen evidence dan lakukan audit AI</p>
          </div>
          {user?.role === 'admin' && (
            <Button
              variant="outline"
              onClick={() => setShowResetDialog(true)}
              className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
              data-testid="hard-reset-button"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Hard Reset Audit
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Selection Panel */}
          <Card className="lg:col-span-1 shadow-md" data-testid="selection-panel">
            <CardHeader>
              <CardTitle>Pilih Klausul</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Kriteria</label>
                <Select value={selectedCriteria} onValueChange={setSelectedCriteria}>
                  <SelectTrigger data-testid="criteria-select">
                    <SelectValue placeholder="Pilih kriteria" />
                  </SelectTrigger>
                  <SelectContent>
                    {criteria.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {clauses.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Klausul</label>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {clauses.map((clause) => (
                      <button
                        key={clause.id}
                        onClick={() => setSelectedClause(clause)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedClause?.id === clause.id
                            ? 'bg-emerald-50 border-emerald-500'
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                        data-testid="clause-select-button"
                      >
                        <div className="font-medium text-sm">{clause.clause_number}</div>
                        <div className="text-xs text-slate-600 mt-1">{clause.title}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Document Upload Panel */}
          <Card className="lg:col-span-2 shadow-md" data-testid="upload-panel">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {selectedClause ? `${selectedClause.clause_number}: ${selectedClause.title}` : 'Pilih klausul'}
                </CardTitle>
                {selectedClause && documents.length > 0 && (
                  <Button
                    onClick={handleAnalyze}
                    disabled={analyzing || !selectedClause.knowledge_base}
                    className="bg-blue-600 hover:bg-blue-700"
                    data-testid="analyze-button"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Menganalisis...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Analisis dengan AI
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedClause ? (
                <>
                  <p className="text-sm text-slate-600">{selectedClause.description}</p>

                  {!selectedClause.knowledge_base && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Perhatian:</strong> Knowledge base belum dikonfigurasi untuk klausul ini. 
                        Silakan tambahkan knowledge base di halaman Klausul sebelum melakukan audit AI.
                      </p>
                    </div>
                  )}

                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors">
                    <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                    <p className="text-sm text-slate-600 mb-4">Upload dokumen evidence (PDF, Word, Excel, gambar)</p>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                      data-testid="file-upload-input"
                    />
                    <label htmlFor="file-upload">
                      <Button
                        type="button"
                        disabled={loading}
                        onClick={() => document.getElementById('file-upload').click()}
                        className="bg-emerald-600 hover:bg-emerald-700"
                        data-testid="upload-button"
                      >
                        {loading ? 'Mengupload...' : 'Pilih File'}
                      </Button>
                    </label>
                  </div>

                  {/* Documents List */}
                  {documents.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm">Dokumen Terupload ({documents.length})</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownloadAllDocuments}
                          className="text-xs"
                          data-testid="download-all-button"
                        >
                          <Archive className="w-3 h-3 mr-1" />
                          Download Semua (ZIP)
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors" data-testid="document-item">
                            <div className="flex items-center gap-3 flex-1">
                              <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{doc.filename}</p>
                                <p className="text-xs text-slate-500">
                                  {(doc.size / 1024).toFixed(1)} KB • {new Date(doc.uploaded_at).toLocaleDateString('id-ID')}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 ml-2">
                              {isPdfOrImage(doc.filename) && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handlePreviewDocument(doc)}
                                  className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                  data-testid="preview-document-button"
                                  title="Preview"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDownloadDocument(doc.id, doc.filename)}
                                className="h-8 w-8 text-green-500 hover:text-green-700 hover:bg-green-50"
                                data-testid="download-document-button"
                                title="Download"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteDocument(doc.id)}
                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                data-testid="delete-document-button"
                                title="Hapus"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Audit Result */}
                  {auditResult && (
                    <Card className="border-2" data-testid="audit-result-card">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Hasil Audit AI</CardTitle>
                          <Badge
                            variant={auditResult.status === 'Sesuai' ? 'default' : 'destructive'}
                            className={`${auditResult.status === 'Sesuai' ? 'bg-green-600' : 'bg-red-600'}`}
                          >
                            {auditResult.status === 'Sesuai' ? (
                              <CheckCircle className="w-4 h-4 mr-1" />
                            ) : (
                              <XCircle className="w-4 h-4 mr-1" />
                            )}
                            {auditResult.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Skor</span>
                            <span className="text-2xl font-bold" style={{ fontFamily: 'Manrope, sans-serif', color: auditResult.score >= 70 ? '#10b981' : '#ef4444' }}>
                              {auditResult.score.toFixed(1)}
                            </span>
                          </div>
                          <Progress value={auditResult.score} className="h-2" />
                        </div>

                        <div>
                          <h4 className="font-medium text-sm mb-2">Alasan Penilaian</h4>
                          <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded">{auditResult.reasoning}</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm mb-2 text-green-700">Feedback Positif</h4>
                          <p className="text-sm text-slate-700 bg-green-50 p-3 rounded border border-green-200">{auditResult.feedback}</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm mb-2 text-orange-700">Saran Perbaikan</h4>
                          <p className="text-sm text-slate-700 bg-orange-50 p-3 rounded border border-orange-200">{auditResult.improvement_suggestions}</p>
                        </div>

                        <p className="text-xs text-slate-500 text-right">
                          Diaudit pada: {new Date(auditResult.audited_at).toLocaleString('id-ID')}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-600">Pilih klausul untuk mulai mengupload dokumen</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AuditPage;