import React from 'react';
import type { AttireReading } from '../pages/Dashboard';

interface Props {
  data: AttireReading[];
  loading?: boolean;
}

const formatDate = (iso?: string) => (iso ? new Date(iso).toLocaleString() : '-');

const DashboardTable: React.FC<Props> = ({ data, loading = false }) => {
  return (
    <div className="table-wrap">
      <table className="table dashboard-table">
        <thead>
          <tr>
            <th rowSpan={2}>ID</th>
            <th colSpan={3} style={{ textAlign: 'center' }}>Attire Completeness</th>
            <th rowSpan={2}>Date Captured</th>
          </tr>
          <tr>
            <th>Coat</th>
            <th>Shoes</th>
            <th>Gloves</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5}>Loading…</td></tr>
          ) : data.length === 0 ? (
            <tr><td colSpan={5}>No data</td></tr>
          ) : data.map((row) => {
            return (
              <tr key={row.id}>
                <td style={{ verticalAlign: 'middle' }}>{row.id}</td>

                <td className="status-cell">
                  <span className={`status ${row.coat ? 'on' : 'off'}`} aria-label={`coat ${row.coat ? 'present' : 'missing'}`}>
                    {row.coat ? '✓' : '✕'}
                  </span>
                </td>

                <td className="status-cell">
                  <span className={`status ${row.shoes ? 'on' : 'off'}`} aria-label={`shoes ${row.shoes ? 'present' : 'missing'}`}>
                    {row.shoes ? '✓' : '✕'}
                  </span>
                </td>

                <td className="status-cell">
                  <span className={`status ${row.gloves ? 'on' : 'off'}`} aria-label={`gloves ${row.gloves ? 'present' : 'missing'}`}>
                    {row.gloves ? '✓' : '✕'}
                  </span>
                </td>

                <td style={{ verticalAlign: 'middle' }}>{formatDate(row.date_captured)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTable;