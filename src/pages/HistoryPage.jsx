import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { historyAPI } from '../lib/api';
import { 
  History, 
  Mail, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw, 
  Trash2, 
  Sparkles, 
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const HistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);

  const loadHistory = async (resetOffset = true) => {
    const currentOffset = resetOffset ? 0 : offset;
    
    if (resetOffset) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const response = await historyAPI.getAll(limit, currentOffset);
      const newData = response.data.data || [];
      
      if (resetOffset) {
        setHistory(newData);
      } else {
        setHistory(prev => [...prev, ...newData]);
      }
      
      setTotal(response.data.total || 0);
      setOffset(currentOffset + newData.length);
    } catch (error) {
      console.error('Failed to load history:', error);
      toast.error('Failed to load history');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

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

  const formatDuration = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getProcessIcon = (process) => {
    switch (process) {
      case 'email':
        return <Zap size={12} />;
      case 'chat':
        return <Mail size={12} />;
      case 'gen':
      case 'gen-email':
        return <Sparkles size={12} />;
      default:
        return <Mail size={12} />;
    }
  };

  const getProcessLabel = (process) => {
    switch (process) {
      case 'email':
        return 'YOLO';
      case 'chat':
        return 'Chat';
      case 'gen':
        return 'Generate';
      case 'gen-email':
        return 'Detailed';
      default:
        return process || 'Unknown';
    }
  };

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'yolo') return item.process === 'email';
    if (filter === 'detailed') return item.process === 'gen-email';
    return true;
  });

  const handleResend = (item) => {
    if (item.process === 'email') {
      navigate('/send/yolo', { state: { historyItem: item } });
    } else {
      navigate('/send/detailed', { state: { historyItem: item } });
    }
  };

  const handleCardClick = (item) => {
    setExpandedId(expandedId === item.id ? null : item.id);
  };

  const loadMore = () => {
    loadHistory(false);
  };

  const hasMore = offset < total;

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

        {/* History count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <p className="text-sm text-navy-500">
            {total} total records
          </p>
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
                  className={`transition-all ${expandedId === item.id ? 'ring-2 ring-brand-blue/30' : ''} cursor-pointer`}
                  onClick={() => handleCardClick(item)}
                >
                  {/* Item Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {/* Process Type Badge */}
                        <span className={`
                          inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                          ${item.process === 'email' 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : 'bg-brand-blue/10 text-brand-blue'
                          }
                        `}>
                          {getProcessIcon(item.process)}
                          {getProcessLabel(item.process)}
                        </span>

                        {/* Success/Failure Badge */}
                        {item.success ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle size={12} />
                            Sent
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <XCircle size={12} />
                            Failed
                          </span>
                        )}

                        {/* Duration */}
                        <span className="inline-flex items-center gap-1 text-xs text-navy-400">
                          <Clock size={12} />
                          {formatDuration(item.duration_ms)}
                        </span>

                        {/* Date */}
                        <span className="text-xs text-navy-400 flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(item.created_at)}
                        </span>
                      </div>
                      
                      {/* Subject */}
                      <h3 className="font-medium text-navy-800 truncate">
                        {item.subject || 'No subject'}
                      </h3>

                      {/* Recipient */}
                      <p className="text-sm text-navy-500 truncate">
                        To: {item.to}
                      </p>

                      {/* Prompt (always visible) */}
                      <p className="text-sm text-navy-400 mt-2 line-clamp-2">
                        <span className="font-medium">Prompt:</span> {item.prompt || 'No prompt recorded'}
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
                      {/* Error Message (if failed) */}
                      {!item.success && item.error_message && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                          <p className="text-xs text-red-600 font-medium mb-1">Error:</p>
                          <p className="text-sm text-red-700">{item.error_message}</p>
                        </div>
                      )}

                      {/* Prompt */}
                      <div className="mb-4">
                        <p className="text-xs text-navy-400 mb-1">Prompt:</p>
                        <p className="text-sm text-navy-700 bg-navy-50 p-3 rounded-lg">
                          {item.prompt || 'No prompt recorded'}
                        </p>
                      </div>

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
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="secondary"
                  onClick={loadMore}
                  loading={isLoadingMore}
                >
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Load More
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HistoryPage;