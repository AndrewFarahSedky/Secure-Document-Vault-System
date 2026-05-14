import { useState, useEffect, useRef } from 'react';
import { Upload, Download, Trash2, FileText } from 'lucide-react';
import API from '../api';
import toast from 'react-hot-toast';

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const fetchDocs = () => {
    API.get('/documents').then(({ data }) => setDocs(data.documents)).catch(() => {});
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('document', file);
    try {
      await API.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Document uploaded and encrypted!');
      fetchDocs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
    setUploading(false);
    fileRef.current.value = '';
  };

  const handleDownload = async (doc) => {
    try {
      const response = await API.get(`/documents/download/${doc.id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.original_name;
      link.click();
      toast.success('Document downloaded!');
    } catch { toast.error('Download failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this document?')) return;
    try {
      await API.delete(`/documents/${id}`);
      toast.success('Document deleted!');
      fetchDocs();
    } catch { toast.error('Delete failed'); }
  };

  const formatSize = (bytes) => {
    if (!bytes) return 'N/A';
    return bytes < 1024 * 1024 ? `${(bytes/1024).toFixed(1)} KB` : `${(bytes/(1024*1024)).toFixed(1)} MB`;
  };

  return (
    <div className="page">
      <div className="container">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <h1 className="page-title" style={{ margin:0 }}>My Documents</h1>
          <button className="btn btn-primary" onClick={() => fileRef.current.click()} disabled={uploading}>
            <Upload size={16} style={{ display:'inline', marginRight:6 }} />
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
          <input ref={fileRef} type="file" style={{ display:'none' }}
            accept=".pdf,.jpg,.jpeg,.png,.txt,.doc,.docx" onChange={handleUpload} />
        </div>

        <div className="alert alert-info">
          🔒 All documents are encrypted with <strong>AES-256</strong> and signed with <strong>RSA + SHA-256</strong>
        </div>

        <div className="card">
          {docs.length === 0 ? (
            <div style={{ textAlign:'center', padding:40, color:'#64748b' }}>
              <FileText size={48} style={{ marginBottom:12, opacity:0.3 }} />
              <p>No documents yet. Upload your first document!</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Size</th>
                  <th>Type</th>
                  <th>Uploaded</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {docs.map(doc => (
                  <tr key={doc.id}>
                    <td><FileText size={14} style={{ display:'inline', marginRight:6, color:'#3b82f6' }} />{doc.original_name}</td>
                    <td>{formatSize(doc.file_size)}</td>
                    <td style={{ color:'#64748b', fontSize:12 }}>{doc.mime_type}</td>
                    <td style={{ color:'#64748b', fontSize:12 }}>{new Date(doc.uploaded_at).toLocaleDateString()}</td>
                    <td><span style={{ color:'#22c55e', fontSize:12 }}>🔒 Encrypted</span></td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <button className="btn btn-success" style={{ padding:'4px 10px', fontSize:12 }}
                          onClick={() => handleDownload(doc)}>
                          <Download size={12} style={{ display:'inline', marginRight:4 }} />Download
                        </button>
                        <button className="btn btn-danger" style={{ padding:'4px 10px', fontSize:12 }}
                          onClick={() => handleDelete(doc.id)}>
                          <Trash2 size={12} style={{ display:'inline', marginRight:4 }} />Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}