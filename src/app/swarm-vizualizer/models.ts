export class Node {
    id: string;
    hostName: string;
    membership: string;
    status: string;
    availability: string;
    isManager: boolean;
}
export class Service {
    id: string;
    name: string;
    currentReplicas: number;
    replicas: number;
    image: string;
    command: string;
}
export class Task {
    id: string;
    name: string;
    service: Service;
    image: string;
    lastState: string;
    desiredState: string;
    node: Node;
    stats: any;
}
