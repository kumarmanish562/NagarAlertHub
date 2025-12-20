import React from 'react';
import PageTemplate from '../../components/dashboard/PageTemplate';

export const LiveOverview = () => <PageTemplate title="Live Overview" description="Real-time aggregation of all city sensor data and feeds." />;
export const NotificationCenter = () => <PageTemplate title="Notification Center" description="Manage and dispatch push notifications to citizens." />;
export const AlertsEscalations = () => <PageTemplate title="Alerts & Escalations" description="Manage high-priority incidents and authority escalations." />;
export const TrustScore = () => <PageTemplate title="Trust Score" description="View and audit the verification trust scores of contributors." />;
export const CivicScore = () => <PageTemplate title="Civic Score" description="Gamification metrics and citizen engagement leaderboards." />;
export const AuthorityAction = () => <PageTemplate title="Authority Action" description="Track police and municipal response logs." />;
export const SystemHealth = () => <PageTemplate title="System Health" description="Monitor server status, API latency, and database integrity." />;
