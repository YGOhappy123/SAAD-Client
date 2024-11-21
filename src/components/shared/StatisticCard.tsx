import { Card, Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface StatisticCardProps extends PropsWithChildren {
  value: number;
  previousValue: number;
  label?: string;
  unit?: string;
  loading?: boolean;
  background?: string;
  to: string;
}

export default function StatisticCard(props: StatisticCardProps) {
  const [count, setCount] = useState<number>(0);
  const percentGrowth = useMemo(() => {
    return (((props.value - props.previousValue) / props.previousValue) * 100).toFixed(2);
  }, [props.previousValue, props.value]);
  const navigate = useNavigate();
  const isIncreasing = useMemo(() => parseFloat(percentGrowth) > 0, [percentGrowth]);

  useEffect(() => {
    const speed = 100;
    let from = 0;
    const step = props.value / speed;
    const counter = setInterval(function () {
      from += step;
      if (from > props.value) {
        clearInterval(counter);
        setCount(props.value);
      } else {
        setCount(Math.ceil(from));
      }
    }, 1);

    return () => clearInterval(counter);
  }, [props.value]);

  return (
    <Card
      hoverable
      onClick={() => navigate(props.to)}
      loading={props.loading}
      style={{
        borderRadius: '12px',
        boxShadow: '0px 0px 16px rgba(17,17,26,0.1)',
        minHeight: '130px',
        background: props.background,
      }}
    >
      <Row align="middle" gutter={12}>
        <Col>
          {isIncreasing ? (
            <ArrowUpOutlined style={{ background: '#e8efe5', padding: '10px', borderRadius: '8px', color: '#59a959' }} />
          ) : (
            <ArrowDownOutlined style={{ background: '#f9cece', padding: '10px', borderRadius: '8px', color: '#c52525' }} />
          )}
        </Col>
        <Col>
          <Row align="middle">
            <div style={{ marginRight: 8, fontSize: '32px' }}>
              <strong>{props.unit}</strong>
            </div>
            <div style={{ fontSize: '32px' }}>
              <strong>{count ? count.toLocaleString('en-US') : 0}</strong>
            </div>
            {props.value > 0 && props.previousValue > 0 && (
              <span style={{ marginLeft: '8px', color: isIncreasing ? '#59a959' : '#c52525' }}>
                <strong>
                  {isIncreasing ? '+' : ''}
                  {percentGrowth}%
                </strong>
              </span>
            )}
          </Row>
          <div style={{ fontSize: '18px', color: 'grey' }}>{props.label}</div>
        </Col>
      </Row>
    </Card>
  );
}
