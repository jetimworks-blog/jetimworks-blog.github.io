import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { History, Mail, Calendar, ChevronDown, ChevronUp, RefreshCw, Trash2, Sparkles, Zap } from 'lucide-react';

const HISTORY_STORAGE_KEY = 'email_crafter_history';

export const HistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');

  // Load history from localStorage (and sync with backend in future)
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        const parsed = JSON.parse(storedHistory);
        setHistory(parsed.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHistoryItem = (id) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    toast.success('Item removed from history');
  };

  const clearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      setHistory([]);
      localStorage.removeItem(HISTORY_STORAGE_KEY);
      toast.success('All history cleared');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'yolo') return item.process === 'email';
    if (filter === 'detailed') return item.process === 'gen-email';
    return true;
  });

  const handleResend = (item) => {
    // Navigate to the appropriate form with pre-filled data
    if (item.process === 'email') {
      navigate('/send/yolo');
    } else {
      navigate('/send/detailed');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner size={32} />
            <p className="text-navy-500">Loading your email history...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-navy-600 to-navy-800 rounded-xl flex items-center justify-center">
              <History className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-navy-900">
                Email History
              </h1>
              <p className="text-navy-500">Your past creations, all in one place</p>
            </div>
          </div>
        </motion.div>

        {/* Filters & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
        >
          {/* Filter Tabs */}
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'yolo', label: 'YOLO' },
              { value: 'detailed', label: 'Detailed' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${filter === tab.value
                    ? 'bg-navy-700 text-white'
                    : 'bg-navy-100 text-navy-600 hover:bg-navy-200'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Clear All */}
          {history.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllHistory}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </motion.div>

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="text-center py-12">
              <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-navy-400" />
              </div>
              <h3 className="text-lg font-serif font-bold text-navy-800 mb-2">
                No emails crafted yet
              </h3>
              <p className="text-navy-500 mb-6">
                Your email masterpieces will appear here once you create some.
              </p>
              <Button onClick={() => navigate('/home')}>
                <Sparkles className="w-4 h-4 mr-2" />
                Craft Your First Email
              </Button>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className={`transition-all ${expandedId === item.id ? 'ring-2 ring-brand-blue/30' : ''}`}
                >
                  {/* Item Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`
                          inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                          ${item.process === 'email' 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : 'bg-brand-blue/10 text-brand-blue'
                          }
                        `}>
                          {item.process === 'email' ? (
                            <>
                              <Zap size={12} />
                              YOLO
                            </>
                          ) : (
                            <>
                              <Sparkles size={12} />
                              Detailed
                            </>
                          )}
                        </span>
                        <span className="text-xs text-navy-400 flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(item.created_at)}
                        </span>
                      </div>
                      
                      <h3 className="font-medium text-navy-800 truncate">
                        {item.subject}
                      </h3>
                      <p className="text-sm text-navy-500 truncate">
                        To: {item.to}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                      >
                        {expandedId === item.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedId === item.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-navy-100"
                    >
                      {/* Prompt */}
                      <div className="mb-4">
                        <p className="text-xs text-navy-400 mb-1">Your prompt:</p>
                        <p className="text-sm text-navy-700 bg-navy-50 p-3 rounded-lg">
                          {item.prompt}
                        </p>
                      </div>

                      {/* Output Preview */}
                      {item.output && (
                        <div className="mb-4">
                          <p className="text-xs text-navy-400 mb-1">Generated email:</p>
                          <div 
                            className="text-sm text-navy-700 bg-white border border-navy-200 p-3 rounded-lg max-h-48 overflow-y-auto"
                            dangerouslySetInnerHTML={{ __html: item.output }}
                          />
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleResend(item)}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Resend
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteHistoryItem(item.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HistoryPage;
