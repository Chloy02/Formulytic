"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../contexts/TranslationContext';
import EnhancedNavbar from '../../components/EnhancedNavbar';
import styled from 'styled-components';

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #eff6ff 0%, #f1f5f9 100%);

  .dark & {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  }
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const RedirectMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #64748b;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;

  .dark & {
    background: #1e293b;
    color: #cbd5e1;
  }
`;

export default function QuestionnairePage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { t } = useTranslation(); // Translation hook

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/signin');
    } else {
      router.push('/questionnaire-complete');
    }
  }, [isLoggedIn, router]);

  return (
    <PageWrapper>
      <EnhancedNavbar />
      <ContentArea>
        <RedirectMessage>
          {t('Redirecting to questionnaire...')}
        </RedirectMessage>
      </ContentArea>
    </PageWrapper>
  );
}
