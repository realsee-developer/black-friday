"use client";

import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { useKolStatsStore } from "@/store/useKolStatsStore";

export default function KOLStatsPage() {
  const { stats, isLoading, error, lastUpdated, environment, fetchStats } =
    useKolStatsStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const totalExposures = stats.reduce((sum, s) => sum + s.exposureCount, 0);
  const avgExposure = stats.length > 0 ? totalExposures / stats.length : 0;

  return (
    <div className="min-h-screen bg-linear-to-b from-cyber-gray-900 via-cyber-gray-800 to-cyber-gray-900">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-cyber-gray-100 mb-2">
            KOL Video Exposure Statistics
          </h1>
          <div className="flex flex-wrap gap-4 items-center text-cyber-gray-400">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:server" className="w-5 h-5" />
              <span>
                Environment:{" "}
                <span className="text-cyber-brand-500 font-semibold">
                  {environment}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="lucide:clock" className="w-5 h-5" />
              <span>
                Last Updated:{" "}
                {lastUpdated ? new Date(lastUpdated).toLocaleString() : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mb-6 flex justify-between items-center">
          <button
            type="button"
            onClick={fetchStats}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-cyber-brand-500 text-white rounded-lg hover:bg-cyber-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Icon
              icon="lucide:refresh-cw"
              className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg flex items-start gap-3">
            <Icon
              icon="lucide:alert-circle"
              className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
            />
            <div>
              <p className="text-red-400 font-semibold">Error</p>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Icon
              icon="lucide:loader-2"
              className="w-8 h-8 text-cyber-brand-500 animate-spin"
            />
          </div>
        )}

        {/* Stats Overview */}
        {!isLoading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-cyber-gray-800 rounded-lg p-6 border border-cyber-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <Icon
                    icon="lucide:video"
                    className="w-6 h-6 text-cyber-brand-500"
                  />
                  <h3 className="text-cyber-gray-400 text-sm font-medium">
                    Total Videos
                  </h3>
                </div>
                <p className="text-3xl font-bold text-cyber-gray-100">
                  {stats.length}
                </p>
              </div>

              <div className="bg-cyber-gray-800 rounded-lg p-6 border border-cyber-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <Icon
                    icon="lucide:eye"
                    className="w-6 h-6 text-cyber-neon-cyan"
                  />
                  <h3 className="text-cyber-gray-400 text-sm font-medium">
                    Total Exposures
                  </h3>
                </div>
                <p className="text-3xl font-bold text-cyber-gray-100">
                  {totalExposures.toLocaleString()}
                </p>
              </div>

              <div className="bg-cyber-gray-800 rounded-lg p-6 border border-cyber-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <Icon
                    icon="lucide:trending-up"
                    className="w-6 h-6 text-green-500"
                  />
                  <h3 className="text-cyber-gray-400 text-sm font-medium">
                    Avg. Exposure
                  </h3>
                </div>
                <p className="text-3xl font-bold text-cyber-gray-100">
                  {avgExposure.toFixed(1)}
                </p>
              </div>
            </div>

            {/* Stats Table */}
            <div className="bg-cyber-gray-800 rounded-lg border border-cyber-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-cyber-gray-900">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-cyber-gray-300">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-cyber-gray-300">
                        Video
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-cyber-gray-300">
                        Creator
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-cyber-gray-300">
                        Exposures
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-cyber-gray-300">
                        % of Total
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-cyber-gray-300">
                        Preview
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map((stat, index) => {
                      const percentage =
                        totalExposures > 0
                          ? (stat.exposureCount / totalExposures) * 100
                          : 0;

                      return (
                        <tr
                          key={stat.videoId}
                          className="border-t border-cyber-gray-700 hover:bg-cyber-gray-750 transition-colors"
                        >
                          <td className="px-6 py-4 text-cyber-gray-400">
                            #{index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-cyber-gray-100 font-medium">
                              {stat.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-cyber-gray-400">
                            {stat.creator}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-cyber-gray-100 font-semibold">
                              {stat.exposureCount.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-cyber-gray-400">
                            {percentage.toFixed(1)}%
                          </td>
                          <td className="px-6 py-4 text-center">
                            <a
                              href={`https://www.youtube.com/watch?v=${stat.youtubeId}`}
                              target="_blank"
                              rel="noopener "
                              className="inline-flex items-center gap-1 text-cyber-brand-500 hover:text-cyber-brand-400 transition-colors"
                            >
                              <Icon
                                icon="lucide:external-link"
                                className="w-4 h-4"
                              />
                              <span className="text-sm">YouTube</span>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Balance Indicator */}
            {stats.length > 0 && (
              <div className="mt-6 p-4 bg-cyber-gray-800 rounded-lg border border-cyber-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <Icon
                    icon="lucide:bar-chart-3"
                    className="w-5 h-5 text-cyber-brand-500"
                  />
                  <h3 className="text-cyber-gray-100 font-semibold">
                    Exposure Balance
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-cyber-gray-400">Lowest: </span>
                    <span className="text-cyber-gray-100 font-semibold">
                      {stats[0]?.exposureCount.toLocaleString() || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-cyber-gray-400">Highest: </span>
                    <span className="text-cyber-gray-100 font-semibold">
                      {stats[
                        stats.length - 1
                      ]?.exposureCount.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
