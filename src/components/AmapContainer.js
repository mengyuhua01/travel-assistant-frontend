import React, { useEffect, useRef, useState } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import { Card, Spin, Button, Modal } from 'antd';
import './AmapContainer.css';

const AmapContainer = ({ tripData, style }) => {
  const mapContainer = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal / enlarged map state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const modalMapContainer = useRef(null);
  const modalMapInstanceRef = useRef(null);
  const modalGeocoderRef = useRef(null);
  // 存储主地图创建的标记位置，供 modal 使用
  const mapMarkerPositionsRef = useRef([]);
  // 主地图实例与标记引用，用于在 modal 中复用标记对象
  const mainMapInstanceRef = useRef(null);
  const mainMarkersRef = useRef([]);
  const mainMarkersMovedRef = useRef(false);

  // 验证数值是否安全（不是 NaN, Infinity 等）
  const isValidNumber = (num) => {
    return typeof num === 'number' && isFinite(num) && !isNaN(num);
  };

  // 验证坐标是否有效
  const isValidCoordinate = (lng, lat) => {
    return isValidNumber(lng) && isValidNumber(lat) &&
           lng >= -180 && lng <= 180 &&
           lat >= -90 && lat <= 90;
  };

  // 防御性检查：确保 tripData 是有效的
  const safeTripData = React.useMemo(() => {
    if (!tripData || typeof tripData !== 'object') {
      return null;
    }
    
    // 如果 dailyPlan 不存在或不是数组，返回 null
    if (!tripData.dailyPlan || !Array.isArray(tripData.dailyPlan)) {
      return null;
    }

    // 过滤和清理数据
    const cleanDailyPlan = tripData.dailyPlan.filter(day => {
      return day && typeof day === 'object' && isValidNumber(day.day);
    }).map(day => ({
      ...day,
      locations: Array.isArray(day.locations) ? day.locations.filter(loc => {
        if (!loc || typeof loc !== 'object' || (!loc.name && !loc.address)) {
          return false;
        }
        
        // 如果有坐标，验证坐标是否有效
        if (loc.coordinates) {
          return isValidCoordinate(loc.coordinates.longitude, loc.coordinates.latitude);
        }
        
        return true; // 没有坐标的位置也保留，后续会进行地理编码
      }) : []
    }));

    return {
      ...tripData,
      dailyPlan: cleanDailyPlan
    };
  }, [tripData]);

  useEffect(() => {
    let mapInstance = null;

    // 添加标记到地图
    const addMarkersToMap = async (mapInstance, AMap) => {
      if (!mapInstance || !AMap || !safeTripData?.dailyPlan) {
        console.warn('地图实例或数据不完整，跳过标记添加');
        return;
      }

      // 验证 safeTripData 结构
      if (!Array.isArray(safeTripData.dailyPlan)) {
        console.warn('dailyPlan 不是数组，跳过标记添加');
        return;
      }

      try {
        const geocoder = new AMap.Geocoder();
        const allMarkers = [];
        const bounds = new AMap.Bounds();
        const dayColors = ['#ff7875', '#40a9ff', '#73d13d', '#fadb14', '#b37feb', '#52c41a']; // 不同日期的颜色

      // 遍历每天的行程
      for (let dayIndex = 0; dayIndex < safeTripData.dailyPlan.length; dayIndex++) {
        const day = safeTripData.dailyPlan[dayIndex];
        const dayColor = dayColors[dayIndex % dayColors.length];
        const dayMarkers = [];
        
        if (day.locations) {
          // 遍历每天的景点位置
          for (let locIndex = 0; locIndex < day.locations.length; locIndex++) {
            const location = day.locations[locIndex];
            let position;
            try {
              // 如果有坐标信息直接使用，否则进行地理编码
              if (location.coordinates && 
                  isValidCoordinate(location.coordinates.longitude, location.coordinates.latitude)) {
                position = [location.coordinates.longitude, location.coordinates.latitude];
              } else if (location.address || location.name) {
                try {
                  const result = await new Promise((resolve, reject) => {
                    const query = location.address || location.name;
                    if (!query || typeof query !== 'string' || query.trim().length === 0) {
                      reject(new Error('无效的地址或名称'));
                      return;
                    }
                    
                    geocoder.getLocation(query.trim(), (status, data) => {
                      if (status === 'complete' && data.geocodes && data.geocodes.length > 0) {
                        resolve(data.geocodes[0]);
                      } else {
                        reject(new Error(`地理编码失败: ${status}`));
                      }
                    });
                  });
                  
                  if (!result || !result.location || 
                      typeof result.location.lng !== 'number' ||
                      typeof result.location.lat !== 'number' ||
                      isNaN(result.location.lng) || 
                      isNaN(result.location.lat) ||
                      !isFinite(result.location.lng) ||
                      !isFinite(result.location.lat) ||
                      result.location.lng < -180 || result.location.lng > 180 ||
                      result.location.lat < -90 || result.location.lat > 90) {
                    console.warn(`地理编码结果无效，跳过:`, location, result);
                    continue;
                  }
                  position = [result.location.lng, result.location.lat];
                } catch (geocodeError) {
                  console.warn(`地理编码出错，跳过 "${location.name}":`, geocodeError);
                  continue;
                }
              } else {
                console.warn(`位置信息不完整，跳过:`, location);
                continue;
              }
              
              // 验证position是否有效
              if (!position || !Array.isArray(position) || position.length !== 2 ||
                  !isValidCoordinate(position[0], position[1])) {
                console.warn(`坐标验证失败，跳过:`, location, position);
                continue;
              }
              
              // 创建标记，使用安全的偏移值
              let markerOffset;
              try {
                // 确保偏移值是有效数字
                const offsetX = -20;
                const offsetY = -40;
                
                if (isNaN(offsetX) || isNaN(offsetY) || 
                    !isFinite(offsetX) || !isFinite(offsetY)) {
                  console.warn('偏移值包含无效数字，使用默认值');
                  markerOffset = new AMap.Pixel(0, 0);
                } else {
                  markerOffset = new AMap.Pixel(offsetX, offsetY);
                }
              } catch (pixelError) {
                console.warn('创建Pixel偏移时出错，使用默认值:', pixelError);
                markerOffset = new AMap.Pixel(0, 0);
              }

              // 再次验证position在创建标记前
              if (!isValidCoordinate(position[0], position[1])) {
                console.warn('标记位置无效，跳过创建标记:', position);
                continue;
              }

              let marker;
              try {
                marker = new AMap.Marker({
                  position: position,
                  title: location.name || '未知地点',
                  content: `
                    <div class="custom-marker" style="--day-color: ${dayColor}">
                      <div class="marker-content day-${day.day || 1}">
                        <div class="day-badge">第${day.day || 1}天</div>
                        <div class="marker-title">${(location.name || '未知地点').replace(/[<>]/g, '')}</div>
                        <div class="marker-date">${(day.date || '').replace(/[<>]/g, '')}</div>
                      </div>
                    </div>
                  `,
                  offset: markerOffset
                });
              } catch (markerCreateError) {
                console.error('创建标记时出错:', markerCreateError, {
                  position,
                  location: location.name,
                  offset: markerOffset
                });
                continue;
              }

              // 添加信息窗口，确保所有字符串都经过安全处理
              const safeLocationName = (location.name || '未知地点').replace(/[<>"'&]/g, '');
              const safeLocationAddress = (location.address || '地址未知').replace(/[<>"'&]/g, '');
              const safeDayTheme = (day.theme || '无主题').replace(/[<>"'&]/g, '');
              const safeDayDate = (day.date || '未知日期').replace(/[<>"'&]/g, '');
              const safeMorning = (day.morning || '暂无安排').replace(/[<>"'&]/g, '');
              const safeAfternoon = (day.afternoon || '暂无安排').replace(/[<>"'&]/g, '');
              const safeEvening = (day.evening || '暂无安排').replace(/[<>"'&]/g, '');
              
              const infoWindow = new AMap.InfoWindow({
                content: `
                  <div style="padding: 16px; min-width: 220px;">
                    <h4 style="margin: 0 0 12px 0; color: ${dayColor}; border-bottom: 2px solid ${dayColor}; padding-bottom: 4px;">
                      第${day.day || 1}天 - ${safeLocationName}
                    </h4>
                    <p style="margin: 0 0 6px 0;"><strong>📅 日期:</strong> ${safeDayDate}</p>
                    <p style="margin: 0 0 6px 0;"><strong>🎯 主题:</strong> ${safeDayTheme}</p>
                    <p style="margin: 0 0 6px 0;"><strong>📍 地址:</strong> ${safeLocationAddress}</p>
                    <div style="margin-top: 12px; padding: 8px; background: ${dayColor}15; border-radius: 6px; border-left: 3px solid ${dayColor};">
                      <p style="margin: 0; font-size: 12px; color: #666;">
                        <strong>行程安排:</strong><br/>
                        🌅 ${safeMorning}<br/>
                        ☀️ ${safeAfternoon}<br/>
                        🌙 ${safeEvening}
                      </p>
                    </div>
                  </div>
                `
              });

              // 点击标记显示信息窗口
              marker.on('click', () => {
                infoWindow.open(mapInstance, marker.getPosition());
              });

              // 记录到供 modal 使用的数组（防止重复），并保存主标记实例
              try {
                mapMarkerPositionsRef.current = mapMarkerPositionsRef.current || [];
                mapMarkerPositionsRef.current.push({
                  position,
                  name: location.name || location.address || '',
                  address: location.address || '',
                  day: day.day || null,
                  date: day.date || '',
                  theme: day.theme || '',
                  morning: day.morning || '',
                  afternoon: day.afternoon || '',
                  evening: day.evening || ''
                });
              } catch (e) {
                // ignore
              }

              // 保存主地图的 marker 实例，供 modal 时复用（通过移入移出地图）
              try {
                mainMarkersRef.current = mainMarkersRef.current || [];
                mainMarkersRef.current.push(marker);
              } catch (e) {
                // ignore
              }

              dayMarkers.push({ marker, position });
              allMarkers.push(marker);
              
              // 安全地扩展边界
              try {
                // 再次验证position在扩展边界前
                if (Array.isArray(position) && position.length === 2 &&
                    isFinite(position[0]) && isFinite(position[1]) &&
                    !isNaN(position[0]) && !isNaN(position[1])) {
                  bounds.extend(position);
                } else {
                  console.warn('位置数据无效，跳过边界扩展:', position);
                }
              } catch (boundsExtendError) {
                console.warn('扩展地图边界时出错:', boundsExtendError, 'position:', position);
              }
              
            } catch (error) {
              console.warn(`无法获取 "${location.name}" 的坐标:`, error);
              continue;
            }
          }
          
          // 为同一天的景点绘制连接线（仅有效点）
          if (dayMarkers.length > 1) {
            const polylinePoints = dayMarkers
              .map(item => item.position)
              .filter(pos => 
                Array.isArray(pos) && 
                pos.length === 2 && 
                !isNaN(pos[0]) && 
                !isNaN(pos[1]) &&
                pos[0] >= -180 && pos[0] <= 180 &&
                pos[1] >= -90 && pos[1] <= 90
              );
              
            if (polylinePoints.length > 1) {
              try {
                const polyline = new AMap.Polyline({
                  path: polylinePoints,
                  strokeColor: dayColor,
                  strokeWeight: 3,
                  strokeStyle: 'solid',
                  strokeOpacity: 0.8,
                  showDir: true,
                  dirColor: dayColor
                });
                
                mapInstance.add(polyline);
              } catch (polylineError) {
                console.warn('创建连接线时出错:', polylineError, 'points:', polylinePoints);
              }
            }
          }
        }
      }

        // 将所有标记添加到地图
        if (allMarkers.length > 0) {
          try {
            mapInstance.add(allMarkers);
          } catch (addMarkersError) {
            console.error('添加标记到地图时出错:', addMarkersError);
            // 尝试逐个添加标记
            allMarkers.forEach((marker, index) => {
              try {
                mapInstance.add(marker);
              } catch (singleMarkerError) {
                console.warn(`添加第${index}个标记时出错:`, singleMarkerError);
              }
            });
          }
          
          // 如果有标记，调整地图视野以包含所有标记
          try {
            // 检查bounds是否包含有效点
            const boundsString = bounds.toString();
            if (boundsString && !boundsString.includes('NaN') && !boundsString.includes('Infinity')) {
              mapInstance.setBounds(bounds, false, [80, 80, 80, 80]);
            } else {
              throw new Error('bounds包含无效值');
            }
          } catch (boundsError) {
            console.warn('设置地图边界时出错:', boundsError);
            // 如果设置边界失败，尝试设置中心点
            if (allMarkers.length > 0) {
              try {
                const firstMarker = allMarkers[0];
                const position = firstMarker.getPosition();
                if (position && 
                    typeof position.lng === 'number' && 
                    typeof position.lat === 'number' &&
                    !isNaN(position.lng) && 
                    !isNaN(position.lat) &&
                    position.lng >= -180 && position.lng <= 180 &&
                    position.lat >= -90 && position.lat <= 90) {
                  mapInstance.setCenter([position.lng, position.lat]);
                  mapInstance.setZoom(12);
                } else {
                  // 使用默认中心点
                  mapInstance.setCenter([116.397428, 39.90923]);
                  mapInstance.setZoom(10);
                }
              } catch (centerError) {
                console.warn('设置地图中心时出错:', centerError);
                // 最后的备用方案
                mapInstance.setCenter([116.397428, 39.90923]);
                mapInstance.setZoom(10);
              }
            }
          }
        } else {
          console.warn('没有有效的标记可添加到地图');
          // 没有标记时使用默认视图
          mapInstance.setCenter([116.397428, 39.90923]);
          mapInstance.setZoom(10);
        }
      } catch (error) {
        console.error('添加地图标记时出错:', error);
      }
    };

    const initMap = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 检查API key
        if (!process.env.REACT_APP_AMAP_KEY) {
          console.error('高德地图API key未配置');
          setError('地图API key未配置');
          setLoading(false);
          return;
        }
        
        // 初始化高德地图
        const AMap = await AMapLoader.load({
          key: process.env.REACT_APP_AMAP_KEY,
          version: '2.0',
          plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.Geocoder']
        }).catch((loadError) => {
          console.error('高德地图加载失败:', loadError);
          throw new Error(`地图加载失败: ${loadError.message}`);
        });

        // 检查容器是否存在
        if (!mapContainer.current) {
          console.error('地图容器不存在');
          setError('地图容器不存在');
          setLoading(false);
          return;
        }
        
        // 创建地图实例，确保所有数值都是有效的
        const defaultCenter = [116.397428, 39.90923]; // 默认北京坐标
        const defaultZoom = 10;
        const defaultPitch = 30;
        
        // 验证默认值
        if (!Array.isArray(defaultCenter) || defaultCenter.length !== 2 ||
            isNaN(defaultCenter[0]) || isNaN(defaultCenter[1]) ||
            !isFinite(defaultCenter[0]) || !isFinite(defaultCenter[1])) {
          throw new Error('默认地图中心坐标无效');
        }
        
        if (isNaN(defaultZoom) || !isFinite(defaultZoom) || defaultZoom < 1 || defaultZoom > 20) {
          throw new Error('默认缩放级别无效');
        }
        
        if (isNaN(defaultPitch) || !isFinite(defaultPitch) || defaultPitch < 0 || defaultPitch > 60) {
          throw new Error('默认倾斜角度无效');
        }

        mapInstance = new AMap.Map(mapContainer.current, {
          zoom: defaultZoom,
          center: defaultCenter,
          viewMode: '3D',
          pitch: defaultPitch,
          mapStyle: 'amap://styles/fresh'
        });

        // 保存主地图实例引用，供 modal 操作时复用标记
        mainMapInstanceRef.current = mapInstance;

        // 添加工具条和比例尺
        mapInstance.addControl(new AMap.Scale());
        mapInstance.addControl(new AMap.ToolBar());


        
        // 如果有行程数据，添加标记
        if (safeTripData && safeTripData.dailyPlan) {
          console.log('开始添加地图标记，数据:', {
            totalDays: safeTripData.dailyPlan.length,
            totalLocations: safeTripData.dailyPlan.reduce((acc, day) => acc + (day.locations?.length || 0), 0)
          });
          await addMarkersToMap(mapInstance, AMap);
        } else {
          console.log('没有有效的行程数据，跳过添加标记');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('地图初始化失败:', error);
        setError(error.message || '地图加载失败');
        setLoading(false);
      }
    };

    // 添加全局错误处理
    const handleMapError = (error) => {
      console.error('地图运行时错误:', error);
      if (error.message && error.message.includes('Pixel(NaN')) {
        console.error('检测到 Pixel NaN 错误，可能是坐标数据问题');
        setError('地图坐标数据异常，请检查行程数据');
      }
    };

    // 监听未捕获的错误
    window.addEventListener('error', handleMapError);
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && event.reason.message && event.reason.message.includes('Pixel(NaN')) {
        handleMapError(event.reason);
      }
    });

    initMap();

    // 清理函数
    return () => {
      window.removeEventListener('error', handleMapError);
      window.removeEventListener('unhandledrejection', handleMapError);
      
      if (mapInstance) {
        try {
          mapInstance.destroy();
        } catch (destroyError) {
          console.warn('销毁地图实例时出错:', destroyError);
        }
      }
    };
  }, [safeTripData]); // 使用 safeTripData 作为依赖
  
  // 初始化 Modal 内的放大地图
  useEffect(() => {
    if (!modalVisible) return;

    let modalMapInstance = null;
    let isCancelled = false;

    const initModalMap = async () => {
      try {
        setModalLoading(true);
        if (!process.env.REACT_APP_AMAP_KEY) {
          throw new Error('地图API key未配置');
        }

        const AMap = await AMapLoader.load({
          key: process.env.REACT_APP_AMAP_KEY,
          version: '2.0',
          plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.Geocoder']
        });

        if (!modalMapContainer.current) {
          throw new Error('modal 地图容器不存在');
        }

        modalMapInstance = new AMap.Map(modalMapContainer.current, {
          zoom: 10,
          center: [116.397428, 39.90923],
          viewMode: '3D',
          pitch: 30,
          mapStyle: 'amap://styles/fresh'
        });

        modalMapInstance.addControl(new AMap.Scale());
        modalMapInstance.addControl(new AMap.ToolBar());

        const geocoder = new AMap.Geocoder();
        modalGeocoderRef.current = geocoder;

        // 收集并添加所有标记（包含地理编码缺失坐标）
        const bounds = new AMap.Bounds();
        const markers = [];

        // 优先使用主地图已经计算并存储的位置
        const stored = (mapMarkerPositionsRef.current && Array.isArray(mapMarkerPositionsRef.current)) ? mapMarkerPositionsRef.current : [];
        const dayColors = ['#ff7875', '#40a9ff', '#73d13d', '#fadb14', '#b37feb', '#52c41a'];
        if (stored.length > 0) {
          // 按 day 分组，以便绘制连线
          const grouped = {};
          stored.forEach(item => {
            const pos = item.position;
            const dayKey = item.day != null ? String(item.day) : '0';
            if (!grouped[dayKey]) grouped[dayKey] = [];
            grouped[dayKey].push(item);
          });

          // 对每一天的标记进行渲染（带样式和信息窗），并绘制连线
          Object.keys(grouped).forEach(dayKey => {
            const items = grouped[dayKey];
            const dayNum = parseInt(dayKey, 10) || 0;
            const color = dayColors[(dayNum - 1) >= 0 ? (dayNum - 1) % dayColors.length : 0];
            const dayMarkersPositions = [];

            items.forEach(item => {
              const pos = item.position;
              if (!(Array.isArray(pos) && pos.length === 2 && isValidCoordinate(pos[0], pos[1]))) return;
              try {
                // 创建与主地图一致的自定义内容
                const content = `
                  <div class="custom-marker" style="--day-color: ${color}">
                    <div class="marker-content day-${dayNum}">
                      <div class="day-badge">第${dayNum}天</div>
                      <div class="marker-title">${(item.name || '未知地点').replace(/[<>]/g, '')}</div>
                      <div class="marker-date">${(item.date || '').replace(/[<>]/g, '')}</div>
                    </div>
                  </div>
                `;
                const marker = new AMap.Marker({ position: pos, title: item.name || '地点', content, offset: new AMap.Pixel(0,0) });
                marker.on('click', () => {
                  const infoContent = `
                    <div style="padding: 16px; min-width: 220px;">
                      <h4 style="margin: 0 0 12px 0; color: ${color}; border-bottom: 2px solid ${color}; padding-bottom: 4px;">
                        第${dayNum}天 - ${(item.name || '').replace(/[<>"'&]/g, '')}
                      </h4>
                      <p style="margin: 0 0 6px 0;"><strong>📅 日期:</strong> ${(item.date || '').replace(/[<>"'&]/g, '')}</p>
                      <p style="margin: 0 0 6px 0;"><strong>🎯 主题:</strong> ${(item.theme || '').replace(/[<>"'&]/g, '')}</p>
                      <p style="margin: 0 0 6px 0;"><strong>📍 地址:</strong> ${(item.address || '').replace(/[<>"'&]/g, '')}</p>
                      <div style="margin-top: 12px; padding: 8px; background: ${color}15; border-radius: 6px; border-left: 3px solid ${color};">
                        <p style="margin: 0; font-size: 12px; color: #666;">
                          <strong>行程安排:</strong><br/>
                          🌅 ${(item.morning || '').replace(/[<>"'&]/g, '')}<br/>
                          ☀️ ${(item.afternoon || '').replace(/[<>"'&]/g, '')}<br/>
                          🌙 ${(item.evening || '').replace(/[<>"'&]/g, '')}
                        </p>
                      </div>
                    </div>
                  `;
                  const info = new AMap.InfoWindow({ content: infoContent });
                  info.open(modalMapInstance, marker.getPosition());
                });
                marker.setMap(modalMapInstance);
                markers.push(marker);
                dayMarkersPositions.push(pos);
                try { bounds.extend(pos); } catch (err) {}
              } catch (err) {
                console.warn('modal 添加标记失败:', err, pos);
              }
            });

            // 绘制连线
            if (dayMarkersPositions.length > 1) {
              try {
                const polyline = new AMap.Polyline({ path: dayMarkersPositions, strokeColor: color, strokeWeight: 3, strokeStyle: 'solid', strokeOpacity: 0.8, showDir: true, dirColor: color });
                modalMapInstance.add(polyline);
              } catch (polyErr) { console.warn('modal 绘制连线失败:', polyErr); }
            }
          });
        } else if (safeTripData && Array.isArray(safeTripData.dailyPlan)) {
           // 回退：若主地图尚未存储位置，则按原逻辑尝试地理编码
           for (let d = 0; d < safeTripData.dailyPlan.length; d++) {
             const day = safeTripData.dailyPlan[d];
             for (let l = 0; l < (day.locations || []).length; l++) {
               const loc = day.locations[l];
               let pos = null;
               try {
                 if (loc.coordinates && isValidCoordinate(loc.coordinates.longitude, loc.coordinates.latitude)) {
                   pos = [loc.coordinates.longitude, loc.coordinates.latitude];
                 } else if (loc.address || loc.name) {
                   const query = (loc.address || loc.name).trim();
                   if (query) {
                     const result = await new Promise((resolve) => {
                       geocoder.getLocation(query, (status, data) => {
                         if (status === 'complete' && data.geocodes && data.geocodes.length > 0) {
                           resolve(data.geocodes[0]);
                         } else {
                           resolve(null);
                         }
                       });
                     });
                     if (result && result.location && isValidCoordinate(result.location.lng, result.location.lat)) {
                       pos = [result.location.lng, result.location.lat];
                     }
                   }
                 }
               } catch (e) {
                 console.warn('modal 地理编码或坐标解析失败:', e, loc);
               }

               if (pos && isValidCoordinate(pos[0], pos[1])) {
                 try {
                   const marker = new AMap.Marker({ position: pos, title: loc.name || loc.address || '地点', offset: new AMap.Pixel(0,0) });
                   marker.setMap(modalMapInstance);
                   markers.push(marker);
                   try { bounds.extend(pos); } catch (err) { /* ignore */ }
                 } catch (markerErr) {
                   console.warn('modal 添加标记失败:', markerErr, pos);
                 }
               }
             }
           }
        }

        // 调整视野
        try {
          // 优先使用 bounds（如果有效）将视野包含所有标记
          if (markers.length > 0) {
            const bStr = bounds.toString();
            if (bStr && !bStr.includes('NaN') && !bStr.includes('Infinity')) {
              modalMapInstance.setBounds(bounds, false, [60, 60, 60, 60]);
            } else {
              // 回退到第一个标记
              const p = markers[0].getPosition();
              if (p && typeof p.lng === 'number' && typeof p.lat === 'number') {
                modalMapInstance.setCenter([p.lng, p.lat]);
                modalMapInstance.setZoom(12);
              }
            }
          }
        } catch (err) {
          console.warn('设置 modal 视野失败，回退到默认中心:', err);
          // 最后回退
          modalMapInstance.setCenter([116.397428, 39.90923]);
          modalMapInstance.setZoom(10);
        }

        if (!isCancelled) modalMapInstanceRef.current = modalMapInstance;
      } catch (e) {
        console.error('初始化 modal 地图失败:', e);
        setError(e.message || '初始化 modal 地图失败');
      } finally {
        setModalLoading(false);
      }
    };

    initModalMap();

    return () => {
      isCancelled = true;
      try {
        if (modalMapInstanceRef.current) {
          modalMapInstanceRef.current.destroy();
          modalMapInstanceRef.current = null;
        }
      } catch (e) {
        console.warn('销毁 modal 地图失败:', e);
      }
    };
  }, [modalVisible, safeTripData]);
  
  // 关闭 modal 时销毁地图实例
  const handleCloseModal = () => {
    setModalVisible(false);
    setTimeout(() => {
      try {
        // 如果我们在打开 modal 时将主地图的 marker 移入了 modal，需要把它们移回主地图
        if (mainMarkersMovedRef.current && mainMarkersRef.current && mainMapInstanceRef.current) {
          try {
            mainMarkersRef.current.forEach(m => {
              try { m.setMap(mainMapInstanceRef.current); } catch (_) {}
            });
          } catch (e) { /* ignore */ }
          mainMarkersMovedRef.current = false;
        }

        if (modalMapInstanceRef.current) {
          modalMapInstanceRef.current.destroy();
          modalMapInstanceRef.current = null;
        }
      } catch (e) {
        console.warn('销毁 modal 地图失败:', e);
      }
    }, 200);
  };

  // 如果没有 API key，显示提示信息
  if (!process.env.REACT_APP_AMAP_KEY) {
    return (
      <Card 
        title="🗺️ 行程地图" 
        style={style}
        bodyStyle={{ padding: '40px', textAlign: 'center' }}
      >
        <p>地图服务暂时不可用，请联系管理员配置地图API key</p>
      </Card>
    );
  }

  // 如果有错误，显示错误信息
  if (error) {
    return (
      <Card 
        title="🗺️ 行程地图" 
        style={style}
        bodyStyle={{ padding: '40px', textAlign: 'center' }}
      >
        <p style={{ color: '#ff4d4f' }}>地图加载失败: {error}</p>
        <Button 
          onClick={() => {
            setError(null);
            setLoading(true);
            window.location.reload();
          }}
          style={{ marginTop: '10px' }}
        >
          重试
        </Button>
      </Card>
    );
  }

  return (
    <Card
      title="🗺️ 行程地图"
      extra={<Button onClick={() => setModalVisible(true)}>放大查看</Button>}
      style={style}
      bodyStyle={{ padding: 0, position: 'relative' }}
    >
      {loading && (
        <div className="map-loading">
          <Spin size="large" />
          <p style={{ marginTop: 16, color: '#666' }}>地图加载中...</p>
        </div>
      )}
      <div
        ref={mapContainer}
        className="amap-container"
        style={{
          width: '100%',
          height: '400px',
          borderRadius: '6px'
        }}
      />
      <Modal
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width="80%"
        title="放大查看地图 - 全景"
        bodyStyle={{ padding: 0 }}
      >
        {modalLoading && (
          <div style={{ padding: 24, textAlign: 'center' }}>
            <Spin />
            <div style={{ marginTop: 12 }}>地图加载中...</div>
          </div>
        )}
        <div
          ref={modalMapContainer}
          style={{ width: '100%', height: '70vh' }}
        />
      </Modal>
    </Card>
  );
};

export default AmapContainer;
