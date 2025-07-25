"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Package, Truck, MapPin, CheckCircle, Clock, User } from "lucide-react"
import { type TrackingInfo, type TrackingHistory } from "@/services/tracking.service"

interface TrackingTimelineProps {
  trackingInfo: TrackingInfo
  showProgress?: boolean
}

export default function TrackingTimeline({ trackingInfo, showProgress = true }: TrackingTimelineProps) {
  const getStatusIcon = (status: string) => {
    const iconMap: Record<string, JSX.Element> = {
      pending: <Clock className="h-4 w-4" />,
      processing: <Package className="h-4 w-4" />,
      packed: <Package className="h-4 w-4" />,
      tracking_assigned: <MapPin className="h-4 w-4" />,
      in_transit: <Truck className="h-4 w-4" />,
      shipped: <Truck className="h-4 w-4" />,
      out_for_delivery: <Truck className="h-4 w-4" />,
      delivered: <CheckCircle className="h-4 w-4" />,
    }
    return iconMap[status] || <Clock className="h-4 w-4" />
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'bg-yellow-600',
      processing: 'bg-blue-600',
      packed: 'bg-blue-600',
      tracking_assigned: 'bg-purple-600',
      in_transit: 'bg-orange-600',
      shipped: 'bg-orange-600',
      out_for_delivery: 'bg-green-600',
      delivered: 'bg-green-600',
    }
    return colorMap[status] || 'bg-gray-600'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCourierService = (service: string) => {
    const serviceMap: Record<string, string> = {
      regular: 'Reguler',
      express: 'Express',
      same_day: 'Same Day',
    }
    return serviceMap[service] || service
  }

  return (
    <Card className="bg-slate-700 border-slate-600">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Lacak Pesanan
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="border-slate-500 text-slate-300">
                {trackingInfo.order_number}
              </Badge>
              {trackingInfo.tracking_number && (
                <Badge variant="outline" className="border-slate-500 text-slate-300">
                  Resi: {trackingInfo.tracking_number}
                </Badge>
              )}
              <Badge className="bg-blue-600 hover:bg-blue-700">
                {formatCourierService(trackingInfo.courier_service)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Progress Bar */}
        {showProgress && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Progress Pengiriman</span>
              <span className="text-sm text-slate-300">{trackingInfo.tracking_progress}%</span>
            </div>
            <Progress 
              value={trackingInfo.tracking_progress} 
              className="h-2 bg-slate-600"
            />
          </div>
        )}

        {/* Current Status */}
        {trackingInfo.latest_status && (
          <div className="mb-6 p-4 bg-slate-600 rounded-lg border border-slate-500">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${getStatusColor(trackingInfo.latest_status.status)} text-white`}>
                {getStatusIcon(trackingInfo.latest_status.status)}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1">
                  Status Terkini
                </h4>
                <p className="text-slate-300 text-sm mb-1">
                  {trackingInfo.latest_status.description}
                </p>
                {trackingInfo.latest_status.location && (
                  <p className="text-slate-400 text-xs mb-1">
                    📍 {trackingInfo.latest_status.location}
                  </p>
                )}
                <p className="text-slate-400 text-xs">
                  {formatDate(trackingInfo.latest_status.timestamp)}
                </p>
              </div>
            </div>
          </div>
        )}

        <Separator className="bg-slate-600 my-4" />

        {/* Tracking History */}
        <div>
          <h4 className="font-semibold text-white mb-4">Riwayat Pengiriman</h4>
          
          {trackingInfo.tracking_history.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">Belum ada riwayat tracking tersedia</p>
            </div>
          ) : (
            <div className="space-y-4">
              {trackingInfo.tracking_history
                .slice()
                .reverse()
                .map((history, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`p-2 rounded-full ${getStatusColor(history.status)} text-white`}>
                      {getStatusIcon(history.status)}
                    </div>
                    {index < trackingInfo.tracking_history.length - 1 && (
                      <div className="w-0.5 h-8 bg-slate-600 mt-2" />
                    )}
                  </div>
                  
                  <div className="flex-1 pb-4">
                    <div className="bg-slate-600 p-3 rounded-lg border border-slate-500">
                      <p className="text-white font-medium mb-1">
                        {history.description}
                      </p>
                      
                      {history.location && (
                        <p className="text-slate-300 text-sm mb-1">
                          📍 {history.location}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{formatDate(history.timestamp)}</span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {history.updated_by}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delivery Timestamps */}
        {(trackingInfo.shipped_at || trackingInfo.delivered_at) && (
          <>
            <Separator className="bg-slate-600 my-4" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              {trackingInfo.shipped_at && (
                <div>
                  <p className="text-slate-400">Tanggal Pengiriman</p>
                  <p className="text-white font-medium">
                    {formatDate(trackingInfo.shipped_at)}
                  </p>
                </div>
              )}
              {trackingInfo.delivered_at && (
                <div>
                  <p className="text-slate-400">Tanggal Diterima</p>
                  <p className="text-white font-medium">
                    {formatDate(trackingInfo.delivered_at)}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}