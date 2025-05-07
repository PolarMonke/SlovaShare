// components/Common/ReportModal.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ReportModal = ({ onClose, onSubmit }) => {
    const { t } = useTranslation();
    const [reportReason, setReportReason] = useState('');
    const [reportDetails, setReportDetails] = useState('');

    const handleSubmit = () => {
        if (!reportReason) return;
        onSubmit(reportReason, reportDetails);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{t('Report Story')}</h3>
                <div className="form-group">
                    <label>{t('Reason')}</label>
                    <select 
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="report-select"
                        required
                    >
                        <option value="">{t('Select a reason')}</option>
                        <option value="Spam">{t('Spam')}</option>
                        <option value="Inappropriate">{t('Inappropriate Content')}</option>
                        <option value="Plagiarism">{t('Plagiarism')}</option>
                        <option value="Other">{t('Other')}</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>{t('Details')}</label>
                    <textarea
                        value={reportDetails}
                        onChange={(e) => setReportDetails(e.target.value)}
                        className="universal-textarea"
                        placeholder={t('Please provide details about your report')}
                    />
                </div>
                <div className="modal-actions">
                    <button onClick={onClose}>
                        {t('Cancel')}
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={!reportReason}
                        className="submit-report-button"
                    >
                        {t('Submit Report')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;