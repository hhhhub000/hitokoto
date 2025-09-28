import React, { useState, useRef } from 'react';
import { CreateDiaryRequest } from '@/types';
import { validateImageFile, isTextValid } from '@/utils/helpers';
import Button from '../common/Button';
import Textarea from '../common/Textarea';

interface DiaryFormProps {
  onSubmit: (data: CreateDiaryRequest) => Promise<boolean>;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: {
    text: string;
  };
  mode?: 'create' | 'edit';
}

const DiaryForm: React.FC<DiaryFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
  mode = 'create',
}) => {
  const [text, setText] = useState(initialData?.text || '');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [textError, setTextError] = useState('');
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // テキスト変更ハンドラー
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);
    
    if (textError && isTextValid(value)) {
      setTextError('');
    }
  };

  // 画像選択ハンドラー
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      setImage(null);
      setImagePreview('');
      setImageError('');
      return;
    }

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setImageError(validation.error || '');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setImage(file);
    setImageError('');

    // プレビュー画像を作成
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 画像削除ハンドラー
  const handleImageRemove = () => {
    setImage(null);
    setImagePreview('');
    setImageError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // フォーム送信ハンドラー
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    if (!isTextValid(text)) {
      setTextError('テキストを入力してください（1-140文字）');
      return;
    }

    setTextError('');

    // 送信データを作成
    const submitData: CreateDiaryRequest = {
      text: text.trim(),
    };

    if (image && mode === 'create') {
      submitData.image = image;
    }

    // 送信実行
    const success = await onSubmit(submitData);
    
    if (success) {
      // フォームをリセット
      setText('');
      setImage(null);
      setImagePreview('');
      setTextError('');
      setImageError('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* テキスト入力 */}
      <Textarea
        label="今日のひとこと"
        value={text}
        onChange={handleTextChange}
        placeholder="今日の出来事や気持ちを一言で..."
        rows={4}
        maxLength={140}
        showCharCount
        error={textError}
        required
      />

      {/* 画像アップロード（作成時のみ） */}
      {mode === 'create' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            写真（任意）
          </label>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            {imagePreview ? (
              <div className="space-y-3">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="プレビュー"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleImageRemove}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="mt-4">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      写真をアップロード
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">
                      JPEG, PNG, GIF（最大5MB）
                    </span>
                  </label>
                  <input
                    id="image-upload"
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            )}
          </div>
          
          {imageError && (
            <p className="text-sm text-red-600">{imageError}</p>
          )}
        </div>
      )}

      {/* アクションボタン */}
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          キャンセル
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isLoading}
          disabled={!isTextValid(text)}
        >
          {mode === 'create' ? '投稿する' : '更新する'}
        </Button>
      </div>
    </form>
  );
};

export default DiaryForm;