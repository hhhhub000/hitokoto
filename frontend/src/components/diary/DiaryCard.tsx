import React from 'react';
import { Diary } from '@/types';
import { formatRelativeTime } from '@/utils/helpers';
import Button from '../common/Button';

interface DiaryCardProps {
  diary: Diary;
  onEdit: (diary: Diary) => void;
  onDelete: (diary: Diary) => void;
  onView: (diary: Diary) => void;
}

const DiaryCard: React.FC<DiaryCardProps> = ({ diary, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* 画像表示エリア */}
      {diary.imageUrl && (
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={diary.imageUrl}
            alt="日記の画像"
            className="w-full h-48 object-cover cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => onView(diary)}
          />
        </div>
      )}

      {/* コンテンツエリア */}
      <div className="p-4">
        {/* テキスト */}
        <p 
          className="text-gray-800 mb-3 cursor-pointer hover:text-gray-600 transition-colors"
          onClick={() => onView(diary)}
        >
          {diary.text}
        </p>

        {/* 日時とアクション */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {formatRelativeTime(diary.createdAt)}
          </span>

          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(diary)}
            >
              編集
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => onDelete(diary)}
            >
              削除
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryCard;