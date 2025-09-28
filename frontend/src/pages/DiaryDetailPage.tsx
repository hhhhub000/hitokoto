import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDiaryStore } from '@/stores/diaryStore';
import { formatDate } from '@/utils/helpers';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';

const DiaryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentDiary,
    isLoading,
    isDeleting,
    error,
    fetchDiaryById,
    deleteDiary,
    clearError,
    clearCurrentDiary,
  } = useDiaryStore();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 日記詳細を取得
  useEffect(() => {
    if (id) {
      fetchDiaryById(id);
    }
    
    return () => {
      clearCurrentDiary();
    };
  }, [id, fetchDiaryById, clearCurrentDiary]);

  // 削除確認ダイアログ表示
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  // 削除実行
  const handleDeleteConfirm = async () => {
    if (!currentDiary) return;

    const success = await deleteDiary(currentDiary.id);
    if (success) {
      navigate('/');
    }
  };

  // 削除キャンセル
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  // エラー時のリトライ
  const handleRetry = () => {
    if (id) {
      clearError();
      fetchDiaryById(id);
    }
  };

  // ローディング表示
  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner size="lg" className="py-20" />
      </Layout>
    );
  }

  // エラー表示
  if (error) {
    return (
      <Layout>
        <ErrorMessage
          message={error}
          onRetry={handleRetry}
        />
      </Layout>
    );
  }

  // 日記が見つからない場合
  if (!currentDiary) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h3 className="text-lg font-medium text-gray-900 mb-2">日記が見つかりません</h3>
          <p className="text-gray-600 mb-6">指定された日記は存在しないか、削除された可能性があります。</p>
          <Link to="/">
            <Button variant="primary">一覧に戻る</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* ナビゲーション */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            一覧に戻る
          </Link>
        </div>

        {/* 日記カード */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* 画像 */}
          {currentDiary.imageUrl && (
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={currentDiary.imageUrl}
                alt="日記の画像"
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          {/* コンテンツ */}
          <div className="p-6">
            {/* 投稿日時 */}
            <div className="text-sm text-gray-500 mb-4">
              {formatDate(currentDiary.createdAt)}
              {currentDiary.updatedAt !== currentDiary.createdAt && (
                <span className="ml-2">（更新: {formatDate(currentDiary.updatedAt)}）</span>
              )}
            </div>

            {/* テキスト */}
            <div className="text-gray-800 text-lg leading-relaxed mb-6">
              {currentDiary.text}
            </div>

            {/* アクションボタン */}
            <div className="flex items-center space-x-3">
              <Link to={`/edit/${currentDiary.id}`}>
                <Button variant="primary">編集</Button>
              </Link>
              <Button
                variant="danger"
                onClick={handleDeleteClick}
              >
                削除
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 削除確認モーダル */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        title="日記を削除"
        footer={
          <>
            <Button
              variant="outline"
              onClick={handleDeleteCancel}
              disabled={isDeleting}
            >
              キャンセル
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              loading={isDeleting}
            >
              削除する
            </Button>
          </>
        }
      >
        <p className="text-gray-600">
          この日記を削除しますか？この操作は取り消せません。
        </p>
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-800">{currentDiary.text}</p>
        </div>
      </Modal>
    </Layout>
  );
};

export default DiaryDetailPage;