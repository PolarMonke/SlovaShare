import React from 'react'
import { useTranslation } from 'react-i18next';

export default function Footer() {  
  const { t } = useTranslation();
  return (
    <footer>
        {t("All rights reserved")} &copy; 
        <div>
        </div>
    </footer>
  )
}