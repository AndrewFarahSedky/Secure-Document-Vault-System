import { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import API from '../api';
import toast from 'react-hot-toast';

export default function Verify() {
  const [docs, setDocs] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    API.get('/documents').then(({ data }) => setDocs(data.documents)).catch(() => {});
  }, []);

  const handleVerify = async () => {
    if (!selectedId) { toast.error('Please select a document'); return; }
    setLoading(true);
    setResult(null);
    try {
      const { data } = await API.get(`/documents/verify/${selectedId}`);
      setResult(data);
    } catch { toast.error('Verification failed'); }
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth:700 }}>
        <h1 className="page-title">Document Integrity Verification</h1>

        <div className="card" style={{ marginBottom:20 }}>
          <h3 style={{ marginBottom:16 }}>Select Document to Verify</h3>
          <div style={{ display:'flex', gap:12 }}>
            <select className="input" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
              <option value="">-- Select a document --</option>
              {docs.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.original_name}</option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={handleVerify} disabled={loading} style={{ whiteSpace:'nowrap' }}>
              {loading ? 'Verifying...' : '🔍 Verify'}
            </button>
          </div>
        </div>

        {result && (
          <div className="card">
            <div style={{ textAlign:'center', marginBottom:24 }}>
              {result.verified ? (
                <><CheckCircle size={64} color="#22c55e" /><h2 style={{ color:'#22c55e', marginTop:8 }}>Document Verified ✅</h2></>
              ) : (
                <><XCircle size={64} color="#ef4444" /><h2 style={{ color:'#ef4444', marginTop:8 }}>Document Tampered ❌</h2></>
              )}
            </div>

            <div style={{ display:'grid', gap:12 }}>
              <div style={{ padding:12, background:'#0f172a', borderRadius:8 }}>
                <div style={{ fontSize:12, color:'#64748b', marginBottom:4 }}>Hash Match</div>
                <div style={{ color: result.hashMatch ? '#22c55e' : '#ef4444' }}>
                  {result.hashMatch ? '✅ Hashes match' : '❌ Hashes do NOT match'}
                </div>
              </div>
              <div style={{ padding:12, background:'#0f172a', borderRadius:8 }}>
                <div style={{ fontSize:12, color:'#64748b', marginBottom:4 }}>Digital Signature</div>
                <div style={{ color: result.signatureValid ? '#22c55e' : '#ef4444' }}>
                  {result.signatureValid ? '✅ Signature valid' : '❌ Signature invalid'}
                </div>
              </div>
              <div style={{ padding:12, background:'#0f172a', borderRadius:8 }}>
                <div style={{ fontSize:12, color:'#64748b', marginBottom:4 }}>Original Hash (SHA-256)</div>
                <div style={{ fontFamily:'monospace', fontSize:11, wordBreak:'break-all', color:'#94a3b8' }}>{result.originalHash}</div>
              </div>
              <div style={{ padding:12, background:'#0f172a', borderRadius:8 }}>
                <div style={{ fontSize:12, color:'#64748b', marginBottom:4 }}>Current Hash (SHA-256)</div>
                <div style={{ fontFamily:'monospace', fontSize:11, wordBreak:'break-all', color:'#94a3b8' }}>{result.currentHash}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}