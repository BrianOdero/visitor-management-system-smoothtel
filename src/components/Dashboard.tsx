import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, Users, CheckCircle, XCircle, Clock, User, Mail, FileText, Building } from 'lucide-react';

interface VisitorRecord {
  id: string;
  visitorName: string;
  visitorEmail: string;
  purposeOfVisit: string;
  host: string;
  status: 'approved' | 'rejected' | 'pending';
  visitDate: string;
  phoneNumber: string;
}

interface DashboardProps {
  onBackToForm: () => void;
}

const DUMMY_VISITORS: VisitorRecord[] = [
  {
    id: '1',
    visitorName: 'John Doe',
    visitorEmail: 'john.doe@email.com',
    purposeOfVisit: 'Business Meeting',
    host: 'Raphael Mwangi - Chief Executive Officer',
    status: 'approved',
    visitDate: '2024-01-15',
    phoneNumber: '+254712345678'
  },
  {
    id: '2',
    visitorName: 'Jane Smith',
    visitorEmail: 'jane.smith@company.com',
    purposeOfVisit: 'Project Discussion',
    host: 'Edward Koikai - Software Engineer',
    status: 'pending',
    visitDate: '2024-01-16',
    phoneNumber: '+254723456789'
  },
  {
    id: '3',
    visitorName: 'Michael Johnson',
    visitorEmail: 'michael.j@tech.com',
    purposeOfVisit: 'Technical Consultation',
    host: 'Purity Mwende - Chief Operations Officer',
    status: 'rejected',
    visitDate: '2024-01-17',
    phoneNumber: '+254734567890'
  },
  {
    id: '4',
    visitorName: 'Sarah Wilson',
    visitorEmail: 'sarah.wilson@startup.io',
    purposeOfVisit: 'Partnership Discussion',
    host: 'Joan Lusweti - Sales Admin Team Lead',
    status: 'approved',
    visitDate: '2024-01-18',
    phoneNumber: '+254745678901'
  },
  {
    id: '5',
    visitorName: 'David Brown',
    visitorEmail: 'david.brown@consulting.com',
    purposeOfVisit: 'HR Consultation',
    host: 'Sarah Bosibori - Human Resource Officer',
    status: 'approved',
    visitDate: '2024-01-19',
    phoneNumber: '+254756789012'
  }
];

export const Dashboard: React.FC<DashboardProps> = ({ onBackToForm }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'rejected' | 'pending'>('all');

  const filteredVisitors = DUMMY_VISITORS.filter(visitor => {
    const matchesSearch = visitor.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visitor.visitorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visitor.purposeOfVisit.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || visitor.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const statusCounts = {
    total: DUMMY_VISITORS.length,
    approved: DUMMY_VISITORS.filter(v => v.status === 'approved').length,
    rejected: DUMMY_VISITORS.filter(v => v.status === 'rejected').length,
    pending: DUMMY_VISITORS.filter(v => v.status === 'pending').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToForm}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Back to Form</span>
              </button>
              <div className="hidden sm:block h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-3">
                <img 
                  src="/smoothtel_logo.png" 
                  alt="Smoothtel Logo" 
                  className="h-8 sm:h-10 object-contain"
                />
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-gray-900">Visitor Dashboard</h1>
                  <p className="text-sm text-gray-500">Manage visitor registrations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Visitors</p>
                <p className="text-xl font-bold text-gray-900">{statusCounts.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-xl font-bold text-gray-900">{statusCounts.approved}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold text-gray-900">{statusCounts.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-xl font-bold text-gray-900">{statusCounts.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search visitors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Visitors Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Visitor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm hidden sm:table-cell">Purpose</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm hidden lg:table-cell">Host</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredVisitors.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{visitor.visitorName}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {visitor.visitorEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{visitor.purposeOfVisit}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{visitor.host}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(visitor.status)}`}>
                        {getStatusIcon(visitor.status)}
                        {visitor.status.charAt(0).toUpperCase() + visitor.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <span className="text-sm text-gray-900">{visitor.visitDate}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredVisitors.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No visitors found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Mobile Cards View (Alternative for small screens) */}
        <div className="sm:hidden space-y-4 mt-6">
          {filteredVisitors.map((visitor) => (
            <div key={visitor.id} className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{visitor.visitorName}</p>
                    <p className="text-xs text-gray-500">{visitor.visitorEmail}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(visitor.status)}`}>
                  {getStatusIcon(visitor.status)}
                  {visitor.status.charAt(0).toUpperCase() + visitor.status.slice(1)}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span>{visitor.purposeOfVisit}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Building className="w-4 h-4" />
                  <span className="text-xs">{visitor.host}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Visit Date: {visitor.visitDate}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};