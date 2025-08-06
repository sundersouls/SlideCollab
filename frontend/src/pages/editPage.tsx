import React, { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import PresentationEditor from '../components/presentationEditor';

function EditorWrapper() {
  const navigate = useNavigate();
  const { presentationId } = useParams<{ presentationId: string }>();
  const [searchParams] = useSearchParams();
  const nickname = searchParams.get('nickname');

  useEffect(() => {
    if (!presentationId || !nickname) {
      navigate('/');
    }
  }, [presentationId, nickname, navigate]);

  if (!presentationId || !nickname) {
    return null;
  }

  const handleBack = () => {
    navigate(`/presentations?nickname=${encodeURIComponent(nickname)}`);
  };

  return (
    <PresentationEditor
      presentationId={presentationId}
      nickname={nickname}
      onBack={handleBack}
    />
  );
}

export default EditorWrapper;