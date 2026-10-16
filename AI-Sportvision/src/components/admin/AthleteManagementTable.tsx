import React, { useState } from 'react';
import { AssessmentResult } from '../../types';
import { Search, Filter, ArrowUpDown, Download, CheckCircle2, AlertCircle, Eye } from 'lucide-react';
import jsPDF from 'jspdf';

interface AthleteManagementTableProps {
  assessments: AssessmentResult[];
  onSelectAthleteAssessment: (assessment: AssessmentResult) => void;
}

export const AthleteManagementTable: React.FC<AthleteManagementTableProps> = ({
  assessments,
  onSelectAthleteAssessment
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const filtered = assessments.filter((a) => {
    const matchesSearch =
      a.athleteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.athleteDistrict.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.athleteState.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' ? true : a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    return sortOrder === 'desc' ? b.talentScore - a.talentScore : a.talentScore - b.talentScore;
  });

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('SAI National Athlete Discovery Directory - AI Roster', 14, 20);
    doc.setFontSize(10);
    let y = 32;
    sorted.forEach((item, i) => {
      doc.text(
        `${i + 1}. ${item.athleteName} | District: ${item.athleteDistrict}, ${item.athleteState} | Score: ${item.talentScore}/100 | Status: ${item.status}`,
        14,
        y
      );
      y += 8;
    });
    doc.save('SAI_Athletes_Roster.pdf');
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-['Outfit']">Athlete Roster Management</h2>
          <p className="text-xs text-slate-400">Searchable and exportable database of AI-assessed rural athletes</p>
        </div>

        <button
          onClick={handleExportPDF}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-blue-600/20"
        >
          <Download className="w-4 h-4" />
          <span>Export Roster PDF</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search athlete by name, district, or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="verified">Verified</option>
            <option value="pending_verification">Pending Audit</option>
            <option value="rejected">Rejected</option>
            <option value="retest_requested">Retest Requested</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center space-x-1"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-blue-400" />
            <span>Sort Score ({sortOrder.toUpperCase()})</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <th className="py-3.5 px-4">Name</th>
              <th className="py-3.5 px-4">District / State</th>
              <th className="py-3.5 px-4">Test Evaluated</th>
              <th className="py-3.5 px-4">AI Score</th>
              <th className="py-3.5 px-4">Authenticity</th>
              <th className="py-3.5 px-4">Verification Status</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {sorted.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-4 px-4 font-bold text-white">{item.athleteName}</td>
                <td className="py-4 px-4 text-slate-300">
                  {item.athleteDistrict}, <span className="text-slate-400">{item.athleteState}</span>
                </td>
                <td className="py-4 px-4 font-semibold uppercase text-blue-400">
                  {item.testType.replace('_', ' ')}
                </td>
                <td className="py-4 px-4">
                  <span className="font-black text-green-400 text-sm">{item.talentScore}</span> / 100
                </td>
                <td className="py-4 px-4 font-semibold text-slate-300">
                  {item.authenticityScore}%
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    item.status === 'verified'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : item.status === 'pending_verification'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : item.status === 'retest_requested'
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <button
                    onClick={() => onSelectAthleteAssessment(item)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-200 text-xs font-semibold flex items-center space-x-1.5 ml-auto transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Review Video</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
