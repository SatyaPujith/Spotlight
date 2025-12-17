import React, { useState } from 'react';
import { IntelligenceData, IntelligenceType, Business } from '../types';
import { MapPin, Star, DollarSign, TrendingUp, CheckCircle, Info, Clock, Share2, Bookmark, Check } from 'lucide-react';

interface IntelligencePanelProps {
  data: IntelligenceData;
  isLoading: boolean;
  savedBusinessIds: Set<string>;
  onToggleSave: (business: Business) => void;
}

export interface BusinessCardProps {
  business: Business;
  isSaved: boolean;
  onToggleSave: () => void;
}

const IntelligencePanel: React.FC<IntelligencePanelProps> = ({ data, isLoading, savedBusinessIds, onToggleSave }) => {
  if (isLoading && data.type === IntelligenceType.Idle) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
        <p>Analyzing local intelligence...</p>
      </div>
    );
  }

  if (data.type === IntelligenceType.Idle) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 px-8 text-center">
        <MapPin className="w-12 h-12 mb-4 text-indigo-100" />
        <h3 className="text-lg font-medium text-slate-600">Spotlight Intelligence</h3>
        <p className="mt-2 text-sm">Select an area or ask for recommendations to generate a local briefing.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 bg-slate-50/50">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Location Overview Section */}
        {data.locationSummary && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 fade-in">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-slate-800">{data.locationSummary.areaName}</h2>
              <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full uppercase tracking-wide">
                {data.locationSummary.vibe}
              </span>
            </div>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              {data.locationSummary.description}
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                  <span className="text-slate-400 block mb-1">Dominant</span>
                  <div className="flex flex-wrap gap-1">
                    {data.locationSummary.dominantCategories.slice(0, 3).map((cat, i) => (
                      <span key={i} className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{cat}</span>
                    ))}
                  </div>
              </div>
              <div>
                  <span className="text-slate-400 block mb-1">Avg Price</span>
                  <span className="font-medium text-slate-700">{data.locationSummary.averagePrice}</span>
              </div>
            </div>
          </div>
        )}

        {/* Comparison View */}
        {data.type === IntelligenceType.Comparison && data.comparisonPoints && (
          <div className="space-y-4 fade-in">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Comparative Analysis</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {data.comparisonPoints.map((point, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm h-full">
                    <div className="text-xs font-bold text-indigo-500 uppercase mb-2">{point.attribute}</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className={`p-2 rounded ${point.winnerId === 'A' ? 'bg-green-50 border border-green-100' : ''}`}>
                        {point.businessA}
                      </div>
                      <div className={`p-2 rounded ${point.winnerId === 'B' ? 'bg-green-50 border border-green-100' : ''}`}>
                        {point.businessB}
                      </div>
                    </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Business Cards / Recommendations */}
        {data.businesses && data.businesses.length > 0 && (
          <div className="space-y-4 fade-in">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              {data.type === IntelligenceType.Comparison ? 'Contenders' : 'Top Recommendations'}
            </h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {data.businesses.map((biz) => (
                <BusinessCard 
                  key={biz.id} 
                  business={biz} 
                  isSaved={savedBusinessIds.has(biz.id)}
                  onToggleSave={() => onToggleSave(biz)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Reservation Status */}
        {data.type === IntelligenceType.Reservation && data.reservationDetails && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100 text-center fade-in max-w-md mx-auto">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              {data.reservationDetails.status === 'confirmed' ? <CheckCircle className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              {data.reservationDetails.status === 'confirmed' ? 'Reservation Confirmed' : 'Booking Requested'}
            </h3>
            <p className="text-slate-500 text-sm mb-4">
              {data.reservationDetails.businessName}
            </p>
            <div className="flex justify-center gap-4 text-sm text-slate-700 border-t border-slate-100 pt-4">
              <div>
                <span className="block text-slate-400 text-xs">Date</span>
                {data.reservationDetails.date}
              </div>
              <div>
                <span className="block text-slate-400 text-xs">Time</span>
                {data.reservationDetails.time}
              </div>
              <div>
                <span className="block text-slate-400 text-xs">Guests</span>
                {data.reservationDetails.partySize}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const BusinessCard: React.FC<BusinessCardProps & { onShare?: () => void }> = ({ business, isSaved, onToggleSave }) => {
  const [justCopied, setJustCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
        title: business.name,
        text: `Check out ${business.name} at ${business.address}. ${business.hours || ''}`,
        url: window.location.href 
    };

    if (navigator.share) {
        try { 
          await navigator.share(shareData); 
        } catch (err) {
          // Ignore abort errors
        }
    } else {
        // Fallback
        navigator.clipboard.writeText(`${business.name} - ${business.address}`);
        setJustCopied(true);
        setTimeout(() => setJustCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out group flex flex-col h-full">
      <div className="h-40 bg-slate-200 relative overflow-hidden shrink-0">
        <img 
          src={business.imageUrl || `https://picsum.photos/seed/${business.id}/400/200`} 
          alt={business.name} 
          className="w-full h-full object-cover"
        />
        
        {/* Rating Badge */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-800 flex items-center shadow-sm">
          <Star className="w-3 h-3 text-amber-400 mr-1 fill-amber-400" />
          {business.rating}
          <span className="text-slate-400 ml-1 font-normal">({business.reviewCount})</span>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-2">
           <button 
             onClick={handleShare}
             className="bg-white/90 hover:bg-white text-slate-600 p-1.5 rounded-full backdrop-blur-sm shadow-sm transition-colors hover:text-indigo-600"
             title="Share"
           >
             {justCopied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
           </button>
           <button 
             onClick={(e) => {
               e.stopPropagation();
               onToggleSave();
             }}
             className={`bg-white/90 hover:bg-white p-1.5 rounded-full backdrop-blur-sm shadow-sm transition-colors ${isSaved ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
             title="Save"
           >
             <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
           </button>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-bold text-slate-800 text-lg group-hover:text-indigo-700 transition-colors">{business.name}</h4>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {business.price}
          </span>
        </div>
        
        <p className="text-xs text-slate-500 mb-2">{business.category} • {business.address}</p>
        
        {/* Hours Display */}
        <div className="flex items-center text-xs text-slate-500 mb-3 bg-slate-50 w-fit px-2 py-1 rounded border border-slate-100">
           <Clock className="w-3 h-3 mr-1.5 text-slate-400" />
           {business.hours ? (
             <span>{business.hours}</span>
           ) : (
             <span className="italic text-slate-400">Hours not available - Check listing</span>
           )}
        </div>

        {business.whyThisPlace && (
          <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100 mb-3">
             <div className="flex items-center text-indigo-700 text-xs font-bold mb-1 uppercase tracking-wide">
               <Info className="w-3 h-3 mr-1" />
               Why this place?
             </div>
             <p className="text-indigo-900 text-sm leading-snug">
               {business.whyThisPlace}
             </p>
          </div>
        )}

        <div className="mt-auto pt-2 flex flex-wrap gap-2">
          {business.tags.map((tag, i) => (
            <span key={i} className="text-[10px] text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntelligencePanel;