import React, { useRef, useEffect, useState } from 'react';

const AudioVisualizer = ({ audioSrc }: any) => {
    const canvasRef: any = useRef(null);
    const audioRef: any = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
    if (!audioRef.current || !canvasRef.current) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const sourceNode = audioContext.createMediaElementSource(audioRef.current);

    sourceNode.connect(analyser);
    analyser.connect(audioContext.destination);

    const canvas: any = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId: any;

    const drawVisualizer = () => {
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];
        ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
        }

        animationFrameId = requestAnimationFrame(drawVisualizer);
    };

    if (audioRef.current) {
        audioRef.current.onplay = () => {
        audioContext.resume().then(() => {
            setIsPlaying(true);
        });
        };

        audioRef.current.onpause = () => {
        setIsPlaying(false);
        cancelAnimationFrame(animationFrameId);
        };

        drawVisualizer();
    }

    return () => {
        cancelAnimationFrame(animationFrameId);
    };
    }, [audioSrc]);

    return (
    <div>
        <audio ref={audioRef} controls>
        <source src={audioSrc} type="audio/vaw" />
        Your browser does not support the audio element.
        </audio>
        <canvas ref={canvasRef} width="500" height="150" />
        <div>{isPlaying ? 'Playing' : 'Paused'}</div>
    </div>
    );
};

export default AudioVisualizer;